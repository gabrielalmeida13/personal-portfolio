# =============================================================================
# Portfolio — Go + HTMX
#
# Templates, CSS, JS and fonts are embedded in the binary (go:embed), so the
# runtime image carries the executable and a CA bundle and nothing else.
# =============================================================================

FROM golang:1.26-alpine AS build

WORKDIR /src

# The module has no third-party dependencies; copying the manifest first still
# keeps this layer cached when only source files change.
COPY go.mod ./
RUN go mod download

COPY . .

# Static build: no libc dependency, so the runtime image can stay minimal.
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/server


FROM alpine:3.21 AS runtime

# Outbound TLS to the GitHub and Spotify APIs needs a trust store.
RUN apk add --no-cache ca-certificates

COPY --from=build /out/server /usr/local/bin/server

USER nobody
EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["/usr/local/bin/server"]
