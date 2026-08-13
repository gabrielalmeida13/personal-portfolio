package web

import (
	"html/template"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gabrielalmeida13/personal-portfolio/internal/config"
	"github.com/gabrielalmeida13/personal-portfolio/internal/spotify"
)

func newTestServer(t *testing.T) http.Handler {
	t.Helper()

	// No credentials: every integration should degrade rather than fail.
	srv, err := NewServer(config.Config{ContactEmail: "test@example.com"},
		slog.New(slog.NewTextHandler(io.Discard, nil)))
	if err != nil {
		t.Fatalf("NewServer: %v", err)
	}
	return srv.Routes()
}

func get(t *testing.T, h http.Handler, path string) *httptest.ResponseRecorder {
	t.Helper()
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, path, nil))
	return rec
}

func TestIndexRendersWithoutCredentials(t *testing.T) {
	rec := get(t, newTestServer(t), "/")

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	body := rec.Body.String()
	for _, want := range []string{"Gabriel", "Almeida", "Turntable offline", "test@example.com"} {
		if !strings.Contains(body, want) {
			t.Errorf("body is missing %q", want)
		}
	}
}

// The healthcheck must stay independent of the upstreams: a Spotify outage
// must not make the container look dead and trigger a restart loop.
func TestHealthzIsIndependentOfUpstreams(t *testing.T) {
	rec := get(t, newTestServer(t), "/healthz")

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	if strings.TrimSpace(rec.Body.String()) != "ok" {
		t.Errorf("body = %q, want ok", rec.Body.String())
	}
}

func TestPanelReturnsFragmentNotFullPage(t *testing.T) {
	rec := get(t, newTestServer(t), "/panel/research")

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	body := rec.Body.String()
	if strings.Contains(body, "<!doctype html>") {
		t.Error("panel responded with a full page; it must be a fragment")
	}
	if !strings.Contains(body, `role="dialog"`) {
		t.Error("panel is missing its dialog role")
	}
	if !strings.Contains(body, "ISSRE 2026") {
		t.Error("panel is missing its content")
	}
}

func TestUnknownPanelIs404(t *testing.T) {
	if rec := get(t, newTestServer(t), "/panel/does-not-exist"); rec.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want 404", rec.Code)
	}
}

// The close route shares a prefix with the panel route; Go's mux must prefer
// the literal segment over the wildcard.
func TestClosePanelReturnsEmptyBody(t *testing.T) {
	rec := get(t, newTestServer(t), "/panel/close")

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	if strings.TrimSpace(rec.Body.String()) != "" {
		t.Errorf("body = %q, want empty", rec.Body.String())
	}
}

func TestNowPlayingFragmentIsNotCached(t *testing.T) {
	rec := get(t, newTestServer(t), "/partials/now-playing")

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	if got := rec.Header().Get("Cache-Control"); got != "no-store" {
		t.Errorf("Cache-Control = %q, want no-store", got)
	}
	if !strings.Contains(rec.Body.String(), `id="readout"`) {
		t.Error("fragment must carry the id it replaces")
	}
}

// The readout is what tells the browser to spin the record, so the playing
// flag has to survive templating.
func TestReadoutMarksPlayingState(t *testing.T) {
	srv, err := NewServer(config.Config{}, slog.New(slog.NewTextHandler(io.Discard, nil)))
	if err != nil {
		t.Fatalf("NewServer: %v", err)
	}

	var sb strings.Builder
	data := recordData{Enabled: true, Track: &spotify.Track{
		Playing:    true,
		Title:      "Money",
		Artist:     "Pink Floyd",
		ArtworkURL: "https://i.scdn.co/image/abc",
		Progress:   30000,
		Duration:   60000,
	}}
	if err := srv.tmpl.ExecuteTemplate(&sb, "readout", data); err != nil {
		t.Fatalf("render: %v", err)
	}

	body := sb.String()
	for _, want := range []string{
		`data-playing="true"`,
		`data-art="https://i.scdn.co/image/abc"`,
		"Now playing",
		"width:50.00%",
	} {
		if !strings.Contains(body, want) {
			t.Errorf("readout is missing %q\n%s", want, body)
		}
	}
}

func TestCSSWidthClamps(t *testing.T) {
	cases := []struct {
		in   any
		want template.CSS
	}{
		{50.0, "width:50.00%"},
		{85, "width:85.00%"},
		{-10.0, "width:0.00%"},
		{140.0, "width:100.00%"},
		{"nonsense", "width:0%"},
	}

	for _, tc := range cases {
		if got := cssWidth(tc.in); got != tc.want {
			t.Errorf("cssWidth(%v) = %q, want %q", tc.in, got, tc.want)
		}
	}
}

// Language colours come from the GitHub API and land in a style attribute, so
// anything that is not a plain hex colour must be dropped.
func TestCSSSwatchRejectsNonHex(t *testing.T) {
	if got := cssSwatch("#3178c6"); got != "background:#3178c6" {
		t.Errorf("valid hex was rejected: %q", got)
	}
	for _, bad := range []string{"red", "", "#3178c6;background:url(x)", "javascript:alert(1)"} {
		if got := cssSwatch(bad); got != "background:var(--muted)" {
			t.Errorf("cssSwatch(%q) = %q, want the fallback", bad, got)
		}
	}
}
