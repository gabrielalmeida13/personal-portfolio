// Package config loads runtime configuration from the environment.
//
// Nothing here is strictly required to boot: every external integration
// degrades to an "unavailable" state when its credentials are absent, so the
// site always renders. Load reports which integrations are disabled so that a
// misconfigured deployment is obvious in the logs rather than silently blank.
package config

import (
	"fmt"
	"net/mail"
	"os"
	"strings"
)

type Config struct {
	Addr string

	GitHubToken    string
	GitHubUsername string

	SpotifyClientID     string
	SpotifyClientSecret string
	SpotifyRefreshToken string

	ContactEmail string
	LinkedInURL  string
	GitHubURL    string
}

func (c Config) GitHubEnabled() bool {
	return c.GitHubToken != "" && c.GitHubUsername != ""
}

func (c Config) SpotifyEnabled() bool {
	return c.SpotifyClientID != "" && c.SpotifyClientSecret != "" && c.SpotifyRefreshToken != ""
}

// Load reads the environment and returns the configuration plus a list of
// human-readable warnings describing anything that will run degraded.
func Load() (Config, []string) {
	c := Config{
		Addr:                addr(),
		GitHubToken:         os.Getenv("GITHUB_TOKEN"),
		GitHubUsername:      os.Getenv("GITHUB_USERNAME"),
		SpotifyClientID:     os.Getenv("SPOTIFY_CLIENT_ID"),
		SpotifyClientSecret: os.Getenv("SPOTIFY_CLIENT_SECRET"),
		SpotifyRefreshToken: os.Getenv("SPOTIFY_REFRESH_TOKEN"),
		ContactEmail:        envOr("CONTACT_EMAIL", "gabrielserens@gmail.com"),
		LinkedInURL:         envOr("LINKEDIN_URL", "https://linkedin.com/in/gabriel-almeida"),
		GitHubURL:           envOr("GITHUB_URL", "https://github.com/gabrielalmeida13"),
	}

	var warnings []string
	if !c.GitHubEnabled() {
		warnings = append(warnings, "GITHUB_TOKEN/GITHUB_USERNAME unset: repository panel will render empty")
	}
	if !c.SpotifyEnabled() {
		warnings = append(warnings, "SPOTIFY_CLIENT_ID/SECRET/REFRESH_TOKEN unset: the record will stay silent")
	}
	if _, err := mail.ParseAddress(c.ContactEmail); err != nil {
		warnings = append(warnings, fmt.Sprintf("CONTACT_EMAIL %q is not a valid address", c.ContactEmail))
	}

	return c, warnings
}

func addr() string {
	port := envOr("PORT", "3000")
	if strings.HasPrefix(port, ":") {
		return port
	}
	return ":" + port
}

func envOr(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}
