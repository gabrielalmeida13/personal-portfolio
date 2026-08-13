# Deploying

Push to `main` is the deploy. GitHub Actions runs the tests, builds the image,
publishes it to GHCR, then tells the droplet to pull it and verifies the site
answers. After the one-time setup below you never touch the server again.

## The setup as it exists

| Thing | Value |
|---|---|
| Host | `64.226.88.15` (DigitalOcean, Ubuntu 24.04) |
| Domain | `gabriel-almeida.dev`, `www` redirects to it |
| TLS + proxy | Caddy, already configured: `gabriel-almeida.dev → localhost:3000` |
| Application | Docker container named `portfolio`, listening on 3000 |

Caddy needs no changes. It proxies to `localhost:3000` and the new container
listens there too, so the domain and its certificate keep working.

---

## One-time setup

### 1. Add the deploy key

On your machine, make a key that exists only for deployments:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/portfolio_deploy -N "" -C "github-actions-deploy"
ssh-copy-id -i ~/.ssh/portfolio_deploy.pub root@64.226.88.15
```

### 2. Add the repository secrets

`Settings → Secrets and variables → Actions → New repository secret`:

| Secret | Value |
|---|---|
| `DEPLOY_HOST` | `64.226.88.15` |
| `DEPLOY_USER` | `root` |
| `DEPLOY_SSH_KEY` | the **private** key: `cat ~/.ssh/portfolio_deploy` |

Paste the private key including the `BEGIN`/`END` lines.

### 3. Prepare the server directory

```bash
ssh root@64.226.88.15
mkdir -p /opt/portfolio && cd /opt/portfolio
```

Put the production compose file there — copy `deploy/docker-compose.yml` from
this repository — then create `/opt/portfolio/.env` with the runtime
credentials. The existing values can be reused:

```bash
grep -E '^(SPOTIFY|GITHUB|CONTACT)' /root/personal-portfolio/.env.local > /opt/portfolio/.env
chmod 600 /opt/portfolio/.env
```

The Resend and Upstash variables are not read any more and can be dropped.

### 4. Let the server pull from GHCR

The package is private by default. Either:

- **Make it public** (simplest for a portfolio) — after the first successful
  build, go to the package on GitHub → `Package settings` → `Change
  visibility` → Public. Nothing else to configure.
- **Or keep it private** and log the server in once with a personal access
  token that has `read:packages`:

  ```bash
  echo "$GHCR_TOKEN" | docker login ghcr.io -u gabrielalmeida13 --password-stdin
  ```

### 5. Cut over

The current site runs as a container named `portfolio` started with plain
`docker run`, so it holds the name and the port. Replace it:

```bash
cd /opt/portfolio
docker compose pull
docker rm -f portfolio        # stops the old Next.js container
docker compose up -d
curl -fsS http://localhost:3000/healthz && echo && curl -sI https://gabriel-almeida.dev/ | head -1
```

Expect `ok` and `HTTP/2 200`. Downtime is the couple of seconds between
`rm -f` and `up -d`.

---

## Everyday use

Push to `main`. That is the whole procedure.

Watch it under the repository's **Actions** tab. The workflow fails loudly if
the container does not report healthy within ~30 seconds, and prints the
container logs when it gives up.

To ship without a code change — for example after editing a secret — run the
`deploy` workflow manually from the Actions tab (`workflow_dispatch`).

---

## Rolling back

Every build is also tagged with its commit sha, so a rollback is a retag:

```bash
ssh root@64.226.88.15
cd /opt/portfolio
docker compose down
docker tag ghcr.io/gabrielalmeida13/personal-portfolio:<good-sha> \
           ghcr.io/gabrielalmeida13/personal-portfolio:latest
docker compose up -d
```

The previous Next.js image is still on the droplet as
`gabrielalmeida13/meu-portfolio:latest` if you ever need the old site back:

```bash
docker rm -f portfolio
docker run -d --name portfolio --restart unless-stopped -p 127.0.0.1:3000:3000 \
  --env-file /root/personal-portfolio/.env.local \
  gabrielalmeida13/meu-portfolio:latest
```

---

## Notes

- The container publishes on `127.0.0.1:3000`, not `0.0.0.0:3000` as the old
  one did. Port 3000 stops being reachable from the internet; everything goes
  through Caddy on 443. This is deliberate.
- The healthcheck hits `/healthz`, which touches no upstream. A Spotify outage
  is a degraded page, not an unhealthy container, and must not cause a restart
  loop.
- Logs are capped at 3 × 10 MB so the droplet's disk cannot fill with them.
