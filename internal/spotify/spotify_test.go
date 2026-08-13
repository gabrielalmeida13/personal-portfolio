package spotify

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// newTestClient points a client at a stub server by rewriting the package
// endpoints for the duration of a test.
func newTestClient(t *testing.T, handler http.HandlerFunc) *Client {
	t.Helper()

	srv := httptest.NewServer(handler)
	t.Cleanup(srv.Close)

	c := New("id", "secret", "refresh")
	c.http = srv.Client()

	// Rewrite outbound requests to the stub while preserving the path, so the
	// handler can tell the three endpoints apart.
	c.http.Transport = rewrite{base: srv.URL, next: http.DefaultTransport}
	return c
}

type rewrite struct {
	base string
	next http.RoundTripper
}

func (r rewrite) RoundTrip(req *http.Request) (*http.Response, error) {
	target, err := req.URL.Parse(r.base)
	if err != nil {
		return nil, err
	}
	req.URL.Scheme = target.Scheme
	req.URL.Host = target.Host
	return r.next.RoundTrip(req)
}

func tokenResponse(w http.ResponseWriter) {
	json.NewEncoder(w).Encode(map[string]any{"access_token": "tok", "expires_in": 3600})
}

func TestNowPlayingReturnsPlayingTrack(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/api/token":
			tokenResponse(w)
		case "/v1/me/player/currently-playing":
			json.NewEncoder(w).Encode(map[string]any{
				"is_playing":  true,
				"progress_ms": 61000,
				"item": map[string]any{
					"name":        "Sultans of Swing",
					"duration_ms": 348000,
					"artists":     []map[string]string{{"name": "Dire Straits"}},
					"album": map[string]any{
						"name": "Dire Straits",
						"images": []map[string]any{
							{"url": "https://img/640", "width": 640},
							{"url": "https://img/300", "width": 300},
							{"url": "https://img/64", "width": 64},
						},
					},
					"external_urls": map[string]string{"spotify": "https://open.spotify.com/track/x"},
				},
			})
		default:
			t.Errorf("unexpected path %s", r.URL.Path)
		}
	})

	track, err := c.NowPlaying(context.Background())
	if err != nil {
		t.Fatalf("NowPlaying: %v", err)
	}
	if track == nil {
		t.Fatal("expected a track, got nil")
	}
	if !track.Playing {
		t.Error("expected Playing to be true")
	}
	if track.Title != "Sultans of Swing" || track.Artist != "Dire Straits" {
		t.Errorf("unexpected track: %+v", track)
	}
	// The label is small: the 300px artwork should win over 640 and 64.
	if track.ArtworkURL != "https://img/300" {
		t.Errorf("artwork = %q, want the 300px image", track.ArtworkURL)
	}
	if got := track.Elapsed(); got != "1:01" {
		t.Errorf("Elapsed() = %q, want 1:01", got)
	}
	if got := track.Length(); got != "5:48" {
		t.Errorf("Length() = %q, want 5:48", got)
	}
}

func TestNowPlayingFallsBackToRecentlyPlayed(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/api/token":
			tokenResponse(w)
		case "/v1/me/player/currently-playing":
			// Spotify answers 204 when the player is idle.
			w.WriteHeader(http.StatusNoContent)
		case "/v1/me/player/recently-played":
			json.NewEncoder(w).Encode(map[string]any{
				"items": []map[string]any{{
					"track": map[string]any{
						"name":        "Wish You Were Here",
						"duration_ms": 334000,
						"artists":     []map[string]string{{"name": "Pink Floyd"}},
						"album":       map[string]any{"name": "Wish You Were Here"},
					},
				}},
			})
		default:
			t.Errorf("unexpected path %s", r.URL.Path)
		}
	})

	track, err := c.NowPlaying(context.Background())
	if err != nil {
		t.Fatalf("NowPlaying: %v", err)
	}
	if track == nil {
		t.Fatal("expected the last played track, got nil")
	}
	if track.Playing {
		t.Error("a recently-played track must not report Playing")
	}
	if track.Title != "Wish You Were Here" {
		t.Errorf("Title = %q", track.Title)
	}
}

func TestNowPlayingReturnsNilWhenHistoryIsEmpty(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/api/token":
			tokenResponse(w)
		case "/v1/me/player/currently-playing":
			w.WriteHeader(http.StatusNoContent)
		default:
			json.NewEncoder(w).Encode(map[string]any{"items": []any{}})
		}
	})

	track, err := c.NowPlaying(context.Background())
	if err != nil {
		t.Fatalf("NowPlaying: %v", err)
	}
	if track != nil {
		t.Errorf("expected nil track, got %+v", track)
	}
}

func TestNowPlayingReportsTokenFailure(t *testing.T) {
	c := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
	})

	if _, err := c.NowPlaying(context.Background()); err == nil {
		t.Fatal("expected an error when the token request fails")
	}
}

func TestPercentClampsToTrackLength(t *testing.T) {
	cases := []struct {
		name  string
		track Track
		want  float64
	}{
		{"halfway", Track{Progress: 50, Duration: 100}, 50},
		{"unknown duration", Track{Progress: 50}, 0},
		{"past the end", Track{Progress: 150, Duration: 100}, 100},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := tc.track.Percent(); got != tc.want {
				t.Errorf("Percent() = %v, want %v", got, tc.want)
			}
		})
	}
}
