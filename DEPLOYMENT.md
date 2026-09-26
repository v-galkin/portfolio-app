# Deployment

Live site: https://vg-portfolio.duckdns.org

## How it works

```
push to main ──► GitHub Actions (.github/workflows/ci-cd.yml)
                 1. backend tests (./mvnw test) + frontend lint/build
                 2. build backend image → ghcr.io/v-galkin/portfolio-app-backend (:latest and :<commit>)
                 3. SSH to the server:
                      git pull → docker compose pull portfolio-backend → docker compose up -d
                      wait until portfolio-backend is healthy
                 4. rsync frontend/dist/ → /srv/www/portfolio/   (served by the shared nginx)
                 5. smoke test: the site and /api/profile respond
```

| Part | Runs as |
|---|---|
| Frontend | static files in `/srv/www/portfolio`, served by the shared nginx (no container) |
| Backend | `portfolio-backend` container, image pulled from GHCR |
| Database | `portfolio-db` container (Postgres 16); schema managed by Flyway migrations |
| nginx | shared container for all apps on the server (not in this repo) |

Pull requests only run step 1.

## One-time server setup

1. **Repo:** cloned at `~/portfolio-app` over SSH (`git@github.com:v-galkin/portfolio-app.git`).
2. **`.env`** next to `docker-compose.yml`, from `.env.example`: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `POSTGRES_PASSWORD`, `CORS_ALLOWED_ORIGINS`.
3. **Docker network:** `portfolio-network` exists (shared with nginx).
4. **Frontend folder:** `/srv/www/portfolio`, owned by the deploy user, bind-mounted read-only into nginx at `/usr/share/nginx/html/portfolio`.
5. **nginx** (portfolio server block): `location /` serves that folder with `try_files $uri $uri/ /index.html`; `location /api` proxies to `portfolio-backend:8080` and sets `X-Forwarded-For` and `X-Forwarded-Proto`.
6. **GitHub secrets** in this repo: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (the `github_actions_deploy` key, whose public key is in the server's `authorized_keys`).

The workflow logs the server in to GHCR with its own short-lived token for each deploy and logs out afterwards, so no registry credentials are stored on the server.

## Manual deploy (if Actions is unavailable)

```bash
# frontend (on your PC)
cd frontend && npm ci && npm run build
rsync -az --delete dist/ ubuntu@<server>:/srv/www/portfolio/

# backend (on the server): build locally instead of pulling
cd ~/portfolio-app && git pull
docker compose up -d --build portfolio-db portfolio-backend
```

## Rollback

Every deploy also tags the image with its commit SHA:

```bash
cd ~/portfolio-app
git checkout <good-commit>
docker login ghcr.io          # a token with read:packages, only needed for manual pulls
docker pull ghcr.io/v-galkin/portfolio-app-backend:<good-commit-sha>
docker tag  ghcr.io/v-galkin/portfolio-app-backend:<good-commit-sha> ghcr.io/v-galkin/portfolio-app-backend:latest
docker compose up -d portfolio-backend
```

Flyway migrations only add to the schema, so older backend versions keep working against a newer database. Take a backup before releases that change the schema:
`docker exec portfolio-db pg_dump -U portfolio_user portfolio > ~/portfolio-backup-$(date +%F).sql`
