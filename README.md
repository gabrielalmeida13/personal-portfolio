# Gabriel Almeida — portfolio

A single-page portfolio served by a Go binary with HTMX on the front end. No
JavaScript framework, no bundler, no build step for the front end: templates,
CSS, fonts and the one small script are embedded in the executable.

The page is an instrument panel. Identity on the left, a record on the right
that spins while Spotify says something is playing and rests when it does not,
and a grid of panels that open in place.

---

## Stack

| Layer | Choice |
|---|---|
| Server | Go 1.26, standard library only — `net/http`, `html/template`, `log/slog` |
| Routing | `http.ServeMux` method + pattern routing (no router dependency) |
| Front end | Server-rendered HTML, HTMX 2 for fragments, ~50 lines of vanilla JS |
| Styling | Hand-written CSS with custom properties |
| Fonts | Geist, Geist Mono, Inter — self-hosted, no CDN |
| Integrations | Spotify Web API (now playing), GitHub GraphQL (pinned repos) |
| Deploy | Docker, self-hosted |

The module has **no third-party Go dependencies**. `go.mod` lists none, and
there is no `go.sum`.

---

## Running it

Go 1.26 or newer is required.

```bash
make run      # starts on :3000, loading .env.local if present
make test     # run the suite
make build    # compile to bin/server
make docker   # build and start the container
```

Without credentials the site still serves: the record rests with a "Turntable
offline" readout, and the repositories panel points at GitHub instead of
listing repos. Nothing 500s because a token is missing.

### Environment

```bash
# Spotify — the record
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# GitHub — pinned repositories
GITHUB_TOKEN=              # scope: public_repo, read:user
GITHUB_USERNAME=

# Optional overrides
PORT=3000
CONTACT_EMAIL=
LINKEDIN_URL=
GITHUB_URL=
```

---

## Layout

```
cmd/server/            entrypoint: config, routes, graceful shutdown
internal/config/       environment loading; reports degraded integrations
internal/content/      the written material — bio, panels, stack
internal/spotify/      now-playing client, token and response caching
internal/github/       pinned repositories via GraphQL, cached for an hour
internal/web/          handlers, templates, embedded static assets
  templates/           base, index, turntable, panel
  static/              css, js, fonts, cv.pdf, favicon
```

---

## Routes

| Route | Returns |
|---|---|
| `GET /` | The full page |
| `GET /partials/now-playing` | The readout fragment, polled every 15s (`no-store`) |
| `GET /panel/{id}` | An expanded panel fragment |
| `GET /panel/close` | Empty body — the overlay's visibility is `:empty` in CSS |
| `GET /static/…` | Embedded assets |

---

## How the record works

The turntable is deliberately split across the swap boundary. The readout
fragment is replaced by HTMX every 15 seconds; the spinning element is not,
because replacing it would restart the CSS animation and the record would
visibly jump. The fragment carries `data-playing` and `data-art`, and a small
script copies that state onto the persistent platter.

Only the label rotates. A pressed record is rotationally symmetric, so the
grooves gain nothing from spinning, and the sheen must stay still to read as a
fixed light source.

---

## Caching

| Source | Window | Where |
|---|---|---|
| Spotify track | 10s | in-process, `internal/spotify` |
| Spotify access token | until a minute before expiry | in-process |
| GitHub pinned repos | 1 hour | in-process, `internal/github` |

---

## Deploying

Push to `main`. GitHub Actions runs the tests, builds the image, publishes it
to GHCR and tells the droplet to pull it, then verifies `/healthz` answers
before reporting success.

The site is `https://gabriel-almeida.dev`, served by Caddy on a DigitalOcean
droplet, proxying to the container on `localhost:3000`.

See [`deploy/README.md`](deploy/README.md) for the one-time setup, rollback,
and the production compose file.
