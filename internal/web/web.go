// Package web wires the HTTP surface: one full page, three fragments, and the
// embedded static assets. Templates and assets are compiled into the binary so
// that deployment is a single file with no working-directory assumptions.
package web

import (
	"context"
	"embed"
	"fmt"
	"html/template"
	"log/slog"
	"net/http"
	"regexp"
	"time"

	"github.com/gabrielalmeida13/personal-portfolio/internal/config"
	"github.com/gabrielalmeida13/personal-portfolio/internal/content"
	"github.com/gabrielalmeida13/personal-portfolio/internal/github"
	"github.com/gabrielalmeida13/personal-portfolio/internal/spotify"
)

//go:embed templates/*.html
var templateFS embed.FS

//go:embed static
var staticFS embed.FS

type Server struct {
	cfg     config.Config
	tmpl    *template.Template
	log     *slog.Logger
	github  *github.Client
	spotify *spotify.Client
}

func NewServer(cfg config.Config, log *slog.Logger) (*Server, error) {
	tmpl, err := template.New("").Funcs(funcs()).ParseFS(templateFS, "templates/*.html")
	if err != nil {
		return nil, err
	}

	s := &Server{cfg: cfg, tmpl: tmpl, log: log}
	if cfg.GitHubEnabled() {
		s.github = github.New(cfg.GitHubToken, cfg.GitHubUsername)
	}
	if cfg.SpotifyEnabled() {
		s.spotify = spotify.New(cfg.SpotifyClientID, cfg.SpotifyClientSecret, cfg.SpotifyRefreshToken)
	}
	return s, nil
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /{$}", s.handleIndex)
	mux.HandleFunc("GET /partials/now-playing", s.handleNowPlaying)
	mux.HandleFunc("GET /panel/{id}", s.handlePanel)
	mux.HandleFunc("GET /panel/close", s.handleClosePanel)
	mux.Handle("GET /static/", http.FileServer(http.FS(staticFS)))

	return s.recoverer(mux)
}

// recoverer keeps a template or upstream panic from taking the process down.
func (s *Server) recoverer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if v := recover(); v != nil {
				s.log.Error("panic serving request", "path", r.URL.Path, "value", v)
				http.Error(w, "Something broke on our side.", http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

type pageData struct {
	Profile     content.Profile
	Panels      []content.Panel
	Repos       []github.Repo
	CoreSkills  []string
	SkillGroups []content.SkillGroup
	Record      recordData
	Contact     contactData
}

type contactData struct {
	Email    string
	LinkedIn string
	GitHub   string
}

// recordData is everything the turntable needs. Enabled is false when Spotify
// credentials are absent, which renders a resting record with no readout
// rather than an error.
type recordData struct {
	Enabled bool
	Track   *spotify.Track
}

func (s *Server) handleIndex(w http.ResponseWriter, r *http.Request) {
	data := pageData{
		Profile:     content.Me(),
		Panels:      content.Panels(),
		CoreSkills:  content.CoreSkills(),
		SkillGroups: content.SkillGroups(),
		Record:      s.record(r.Context()),
		Contact: contactData{
			Email:    s.cfg.ContactEmail,
			LinkedIn: s.cfg.LinkedInURL,
			GitHub:   s.cfg.GitHubURL,
		},
	}

	if s.github != nil {
		repos, err := s.github.PinnedRepos(r.Context())
		if err != nil {
			s.log.Error("github lookup failed", "err", err)
		} else {
			data.Repos = repos
		}
	}

	s.render(w, "base", data)
}

func (s *Server) handleNowPlaying(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store")
	s.render(w, "readout", s.record(r.Context()))
}

func (s *Server) handlePanel(w http.ResponseWriter, r *http.Request) {
	panel, ok := content.PanelByID(r.PathValue("id"))
	if !ok {
		http.NotFound(w, r)
		return
	}
	s.render(w, "panel", panel)
}

// handleClosePanel answers the close button with nothing, emptying the overlay
// container. The overlay's visibility is driven by :empty in CSS, so removing
// the content is the whole interaction.
func (s *Server) handleClosePanel(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
}

func (s *Server) record(ctx context.Context) recordData {
	if s.spotify == nil {
		return recordData{}
	}

	ctx, cancel := context.WithTimeout(ctx, 6*time.Second)
	defer cancel()

	track, err := s.spotify.NowPlaying(ctx)
	if err != nil {
		s.log.Error("spotify lookup failed", "err", err)
		return recordData{Enabled: true}
	}
	return recordData{Enabled: true, Track: track}
}

func (s *Server) render(w http.ResponseWriter, name string, data any) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.tmpl.ExecuteTemplate(w, name, data); err != nil {
		// The response is likely already partially written by this point, so
		// the only useful action left is to record it.
		s.log.Error("template render failed", "template", name, "err", err)
	}
}

func funcs() template.FuncMap {
	return template.FuncMap{
		"year":   func() int { return time.Now().Year() },
		"width":  cssWidth,
		"swatch": cssSwatch,
	}
}

// cssWidth renders a percentage as a width declaration. Returning template.CSS
// is what lets html/template place a computed value in a style attribute; the
// value is clamped here so nothing outside 0-100% can be injected.
func cssWidth(v any) template.CSS {
	var pct float64
	switch n := v.(type) {
	case float64:
		pct = n
	case int:
		pct = float64(n)
	default:
		return template.CSS("width:0%")
	}

	if pct < 0 {
		pct = 0
	}
	if pct > 100 {
		pct = 100
	}
	return template.CSS(fmt.Sprintf("width:%.2f%%", pct))
}

// cssSwatch renders a background colour for a language dot. The value arrives
// from the GitHub API, so it is accepted only in #rgb or #rrggbb form and
// otherwise discarded.
func cssSwatch(hex string) template.CSS {
	if !hexColour.MatchString(hex) {
		return template.CSS("background:var(--muted)")
	}
	return template.CSS("background:" + hex)
}

var hexColour = regexp.MustCompile(`^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$`)
