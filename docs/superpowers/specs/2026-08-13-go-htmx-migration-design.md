# Go + HTMX Migration — Architecture Design

## Context

The portfolio is currently Next.js 16 / React 19 / TypeScript, self-hosted via Docker on a home server (the README's "deploys to Vercel" claim is stale — `Dockerfile` and `docker-compose.yml` are the real, current deploy path). The backend logic is thin: every route is either a plain HTTP call to an external API (GitHub GraphQL, Spotify REST, Upstash Redis REST) or local `.mdx` file parsing. None of it depends on a Node-only API, which makes it a clean fit for a full rewrite in Go, with the frontend moving from React to server-rendered HTML + HTMX.

This spec covers the **migration architecture only** — language, project structure, templating, styling, and how HTMX replaces the current React interaction model. It does not cover the new Spotify vinyl widget or visual redesign, which get their own spec next.

## Goals

- Replace Next.js/React/TypeScript with a Go server rendering HTML via `html/template`, using HTMX for the small set of interactions that need a server round-trip.
- Keep the app "un-bloated": stdlib-first, minimal third-party dependencies, no JS build step beyond compiling Tailwind's CSS.
- Preserve current behavior: GitHub pinned repos, Spotify now-playing, Redis-backed blog view counters, self-hosted Docker deploy.
- Blog moves from MDX (with embedded React components) to plain Markdown, starting empty — existing posts are dropped intentionally.

## Non-goals

- Redesigning the bento grid's visual layout (separate spec).
- The Spotify vinyl widget feature (separate spec).
- Adding a database — content stays file-based (Markdown on disk), state stays in Redis (view counters only).

## Stack

| Concern | Choice | Why |
|---|---|---|
| Language | Go | User's explicit pick — new to Go, and this app is mostly HTTP calls + template rendering, which is Go's strongest fit (`net/http` + `html/template`, minimal deps). Rejected Rust: more ceremony (async runtime, verbose error handling) for a thin HTTP/template layer with no performance-critical hot path. |
| Routing | Go 1.22+ stdlib `net/http.ServeMux` | Has method + pattern routing (`GET /blog/{slug}`) built in — no need for chi/gin. |
| Templating | `html/template` | Stdlib, contextual auto-escaping (XSS-safe by default), zero dependencies. Rejected `templ`: adds a code-generation build step and typed-component ergonomics that aren't needed for a template set this small. |
| CSS | Tailwind CSS standalone CLI | Tailwind is a CSS compiler, not a React tool — the standalone binary needs no Node/npm at build or runtime. Keeps existing design tokens/CSS variables and utility classes largely as-is. |
| Frontend interactivity | HTMX + native CSS transitions / View Transitions API | HTMX handles the few real server round-trips (now-playing poll, view-counter POST); CSS/View Transitions handle the bento expand/collapse morph and vinyl spin. Rejected Alpine.js: not needed once interactivity is broken down — nothing left over that CSS/HTMX can't do. |
| Markdown | `goldmark` + `chroma` (via `goldmark-highlighting`) | Replaces `next-mdx-remote` + `rehype-pretty-code`. Plain Markdown only — no embedded-component authoring, matching the "start the blog from zero" decision and the fact that no current post used MDX's component-embedding. |
| Env config | Hand-written `internal/config` package | `os.Getenv` + a `validate()` that fails fast (panics with a clear message) on missing/malformed required vars at boot — same behavior as today's `lib/env.ts` (Zod), no dependency added. |
| Redis | Direct HTTP calls to Upstash's REST API | Upstash is REST-based already (not a TCP protocol), so a Go Redis client library isn't needed — `net/http` + `encoding/json` is enough, consistent with the "stdlib-first" goal. |
| Deploy | Same Docker/Compose shape | Multi-stage build producing a static Go binary in a minimal runtime image (`distroless` or `scratch` instead of `node:alpine` — smaller image, no runtime interpreter). `docker-compose.yml` continues to work unchanged (same port, same `env_file` pattern). |

## Project layout

```
cmd/server/main.go        # entrypoint: loads config, registers routes, starts http.Server
internal/config/          # env var loading + validation (fail-fast at boot)
internal/handlers/        # one file per route group: home.go, blog.go, partials.go
internal/github/          # GitHub GraphQL client — ports lib/github.ts
internal/spotify/         # Spotify OAuth + now-playing client — ports lib/spotify.ts
internal/views/           # Redis view-counter client — ports lib/redis.ts + the views route
internal/blog/            # markdown loading + frontmatter parsing — ports lib/blog.ts
templates/                # html/template files: layout.html, pages/*.html, partials/*.html
static/                   # compiled Tailwind output, fonts, images — served directly via http.FileServer
content/blog/             # *.md posts (empty at migration time)
```

## Data flow

- **`GET /`** — handler fetches pinned repos via the GitHub client (in-memory cache with a TTL sweep goroutine, replacing Next's `revalidate: 3600`), renders the full bento grid page server-side. Block expand/collapse stays pure CSS/JS state toggling — all block content is already present in the initial HTML today (nothing is lazily fetched per-block), so this needs no HTMX round trip.
- **`GET /partials/now-playing`** — returns only the vinyl widget's inner HTML fragment. Polled via `hx-trigger="every 15s"` on the layout, replacing the current client-side `fetch` + `setInterval` in `NowPlaying.tsx`.
- **`GET /blog`, `GET /blog/{slug}`** — rendered from parsed Markdown files. Posts are parsed at request time (blog is tiny; no build step needed), or cached at startup with a `fsnotify` watcher in dev if that turns out to be worth it.
- **`GET /partials/views/{slug}` (read) and `POST /partials/views/{slug}` (increment)** — same Redis incr/get logic as today's `app/api/views/[slug]/route.ts`, invoked via `hx-post` when a post view mounts instead of a `fetch()` in a `useEffect`.

## Error handling

Same graceful-degradation posture as the current TypeScript code: if required credentials for an integration (GitHub, Spotify, Redis) are missing, or an upstream call fails, the client function returns a zero value (`nil` slice, `nil` pointer) and the handler renders that section's "unavailable" state rather than a 500. All errors are logged server-side via `log/slog` with structured fields (route, upstream service, status code) — no error detail is leaked to the response body.

## Testing

- **`internal/*` clients** — table-driven tests against `httptest.NewServer` mocking GitHub/Spotify/Upstash responses (success, empty, upstream error, malformed JSON).
- **Handlers** — `httptest.NewRecorder()` tests asserting status codes and that HTMX partial routes return only the fragment markup, not a full page.
- **Templates** — golden-file tests (render → diff against a checked-in `.html.golden` snapshot) to catch accidental markup regressions.

## Open items for later specs

- Spotify vinyl widget: visual design, spin/playback-state animation, and how `internal/spotify` extends to feed it.
- Overall visual redesign direction (rock/Pink Floyd-inspired), which may touch the bento grid, color system, and typography — separate spec, will use the frontend-design skill.
