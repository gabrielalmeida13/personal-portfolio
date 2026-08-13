GO ?= go
BIN := bin/server

.PHONY: run build test fmt vet clean docker

## run: start the site on :3000, loading .env.local when present
run:
	@set -a; [ -f .env.local ] && . ./.env.local; set +a; $(GO) run ./cmd/server

## build: compile the binary (templates and assets are embedded)
build:
	@mkdir -p bin
	CGO_ENABLED=0 $(GO) build -trimpath -ldflags="-s -w" -o $(BIN) ./cmd/server

## test: run the suite
test:
	$(GO) test ./...

fmt:
	$(GO) fmt ./...

vet:
	$(GO) vet ./...

clean:
	rm -rf bin

## docker: build and start the container
docker:
	docker compose up --build -d
