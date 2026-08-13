// Package spotify reads the current listening state for a single account via
// the Spotify Web API, using the refresh-token grant.
//
// The client caches two things: the access token (until shortly before it
// expires) and the last track lookup (for a few seconds), so that a page that
// polls every 15 seconds does not translate into a request storm upstream.
package spotify

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

const (
	tokenURL          = "https://accounts.spotify.com/api/token"
	nowPlayingURL     = "https://api.spotify.com/v1/me/player/currently-playing"
	recentlyPlayedURL = "https://api.spotify.com/v1/me/player/recently-played?limit=1"

	trackTTL = 10 * time.Second
)

// Track is the view of a track that the page needs. Playing distinguishes
// "this is on right now" from "this is the last thing that was on", which is
// the difference between the record spinning and the record resting.
type Track struct {
	Playing    bool
	Title      string
	Artist     string
	Album      string
	ArtworkURL string
	TrackURL   string
	// Progress and Duration are milliseconds; both are zero when unknown.
	Progress int
	Duration int
}

// Elapsed renders progress as m:ss for the readout under the record.
func (t Track) Elapsed() string { return clock(t.Progress) }

// Length renders duration as m:ss.
func (t Track) Length() string { return clock(t.Duration) }

// Percent is how far through the track we are, 0-100.
func (t Track) Percent() float64 {
	if t.Duration <= 0 {
		return 0
	}
	p := float64(t.Progress) / float64(t.Duration) * 100
	if p > 100 {
		return 100
	}
	return p
}

func clock(ms int) string {
	if ms <= 0 {
		return "0:00"
	}
	total := ms / 1000
	return fmt.Sprintf("%d:%02d", total/60, total%60)
}

type Client struct {
	clientID     string
	clientSecret string
	refreshToken string
	http         *http.Client

	mu          sync.Mutex
	token       string
	tokenExpiry time.Time
	cached      *Track
	cachedAt    time.Time
}

func New(clientID, clientSecret, refreshToken string) *Client {
	return &Client{
		clientID:     clientID,
		clientSecret: clientSecret,
		refreshToken: refreshToken,
		http:         &http.Client{Timeout: 8 * time.Second},
	}
}

// NowPlaying returns the current track, or the most recent one when nothing is
// playing. A nil Track (with a nil error) means "nothing to show" — an empty
// listening history, or an account that has never played anything.
func (c *Client) NowPlaying(ctx context.Context) (*Track, error) {
	c.mu.Lock()
	if c.cached != nil && time.Since(c.cachedAt) < trackTTL {
		t := *c.cached
		c.mu.Unlock()
		return &t, nil
	}
	c.mu.Unlock()

	token, err := c.accessToken(ctx)
	if err != nil {
		return nil, err
	}

	track, err := c.currentlyPlaying(ctx, token)
	if err != nil {
		return nil, err
	}
	if track == nil {
		if track, err = c.recentlyPlayed(ctx, token); err != nil {
			return nil, err
		}
	}

	c.mu.Lock()
	c.cached, c.cachedAt = track, time.Now()
	c.mu.Unlock()

	if track == nil {
		return nil, nil
	}
	t := *track
	return &t, nil
}

func (c *Client) accessToken(ctx context.Context) (string, error) {
	c.mu.Lock()
	if c.token != "" && time.Now().Before(c.tokenExpiry) {
		token := c.token
		c.mu.Unlock()
		return token, nil
	}
	c.mu.Unlock()

	form := url.Values{
		"grant_type":    {"refresh_token"},
		"refresh_token": {c.refreshToken},
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, tokenURL, strings.NewReader(form.Encode()))
	if err != nil {
		return "", err
	}
	creds := base64.StdEncoding.EncodeToString([]byte(c.clientID + ":" + c.clientSecret))
	req.Header.Set("Authorization", "Basic "+creds)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	res, err := c.http.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf("spotify: token request returned %d", res.StatusCode)
	}

	var payload struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	}
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		return "", err
	}
	if payload.AccessToken == "" {
		return "", fmt.Errorf("spotify: token response contained no access token")
	}

	ttl := time.Duration(payload.ExpiresIn) * time.Second
	if ttl <= 0 {
		ttl = time.Hour
	}

	c.mu.Lock()
	c.token = payload.AccessToken
	// Renew a minute early so a request never races the expiry.
	c.tokenExpiry = time.Now().Add(ttl - time.Minute)
	c.mu.Unlock()

	return payload.AccessToken, nil
}

// apiTrack mirrors the subset of Spotify's track object that we read.
type apiTrack struct {
	Name       string `json:"name"`
	DurationMs int    `json:"duration_ms"`
	Artists    []struct {
		Name string `json:"name"`
	} `json:"artists"`
	Album struct {
		Name   string `json:"name"`
		Images []struct {
			URL    string `json:"url"`
			Width  int    `json:"width"`
			Height int    `json:"height"`
		} `json:"images"`
	} `json:"album"`
	ExternalURLs struct {
		Spotify string `json:"spotify"`
	} `json:"external_urls"`
}

func (c *Client) currentlyPlaying(ctx context.Context, token string) (*apiResult, error) {
	res, err := c.get(ctx, nowPlayingURL, token)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	// 204 means the player is idle; 202 means the player is warming up.
	if res.StatusCode == http.StatusNoContent || res.StatusCode == http.StatusAccepted {
		return nil, nil
	}
	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("spotify: currently-playing returned %d", res.StatusCode)
	}

	var payload struct {
		IsPlaying  bool      `json:"is_playing"`
		ProgressMs int       `json:"progress_ms"`
		Item       *apiTrack `json:"item"`
	}
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		return nil, err
	}
	if payload.Item == nil {
		return nil, nil
	}
	return toTrack(payload.Item, payload.IsPlaying, payload.ProgressMs), nil
}

func (c *Client) recentlyPlayed(ctx context.Context, token string) (*apiResult, error) {
	res, err := c.get(ctx, recentlyPlayedURL, token)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("spotify: recently-played returned %d", res.StatusCode)
	}

	var payload struct {
		Items []struct {
			Track *apiTrack `json:"track"`
		} `json:"items"`
	}
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		return nil, err
	}
	if len(payload.Items) == 0 || payload.Items[0].Track == nil {
		return nil, nil
	}
	return toTrack(payload.Items[0].Track, false, 0), nil
}

func (c *Client) get(ctx context.Context, endpoint, token string) (*http.Response, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token)
	return c.http.Do(req)
}

// apiResult is an alias so the two fetchers can share a return type.
type apiResult = Track

func toTrack(t *apiTrack, playing bool, progress int) *Track {
	names := make([]string, 0, len(t.Artists))
	for _, a := range t.Artists {
		names = append(names, a.Name)
	}

	return &Track{
		Playing:    playing,
		Title:      t.Name,
		Artist:     strings.Join(names, ", "),
		Album:      t.Album.Name,
		ArtworkURL: artwork(t),
		TrackURL:   t.ExternalURLs.Spotify,
		Progress:   progress,
		Duration:   t.DurationMs,
	}
}

// artwork picks the smallest image at least 300px wide. The artwork is printed
// onto a label roughly a third of the record's width, so the 640px original is
// wasted bytes and the 64px thumbnail is visibly soft.
func artwork(t *apiTrack) string {
	best := ""
	bestWidth := 0
	for _, img := range t.Album.Images {
		if img.URL == "" {
			continue
		}
		switch {
		case best == "":
			best, bestWidth = img.URL, img.Width
		case bestWidth < 300 && img.Width > bestWidth:
			best, bestWidth = img.URL, img.Width
		case img.Width >= 300 && img.Width < bestWidth:
			best, bestWidth = img.URL, img.Width
		}
	}
	return best
}
