# Future Improvements

Project-level improvements that aren't tied to only the backend or only the frontend: deployment, documentation and infrastructure.

Status key: `[ ]` open · `[x]` done

Related: [FRONTEND.md](FRONTEND.md) (frontend; all items done)

---

## Target deployment: who builds and deploys what

**Decided on 2026-09-26:** the frontend no longer gets its own container. The server already runs a **shared nginx container** (TLS for `vg-portfolio.duckdns.org`, serving several apps: portfolio, Sentinel, Snippets, Weather). It keeps serving the portfolio's static files; only the way they get there changes.

```
GitHub Actions (or your PC, until #1 exists)          Server
────────────────────────────────────────────          ───────────────────────────────────────────────
FRONTEND  npm ci → npm run build → dist/ ──rsync──►   /srv/www/portfolio/          (normal folder)
                                                            │ bind mount, read-only
                                                            ▼
                                                      shared nginx  /usr/share/nginx/html/portfolio
                                                            │  location /     → static files
                                                            │  location /api/ → portfolio-backend:8080
BACKEND   tests ──ssh──► git pull + docker compose ──►  portfolio-backend (Spring Boot container)
                                                            └──► portfolio-db (Postgres container)
```

| Part | Built by | Deployed by | Runs as |
|---|---|---|---|
| **Frontend** | GitHub Actions (`npm ci && npm run build`); by hand on your PC until #1 exists | `rsync --delete` of `dist/` into `/srv/www/portfolio/` | nothing: static files served by the shared nginx |
| **Backend** | The server, via `backend/Dockerfile` (Maven inside Docker) | GitHub Actions over SSH: `git pull` + `docker compose up -d --build` | `portfolio-backend` container |
| **Database** | Official `postgres:16-alpine` image | `docker compose` | `portfolio-db` container, schema managed by Flyway |
| **nginx** | Not in this repo (shared with other apps) | Managed separately on the server | Shared container on `portfolio-network` |

**Why no frontend container:** after the build, the frontend is only files (HTML, JS, CSS). The server needs nothing running for it, because nginx already serves files. The one-shot "copy into a volume" container was the cause of the workarounds in `deployemnt.md` (a volume path clashing with the build files, stale hashed files).

---

## 1. CD pipeline

**Current state:** CI runs the backend tests on pushes and PRs (`backend-tests.yml`). There's no frontend CI and no automated deploy. Deploying is manual (see #3 for the manual steps).

**Goal:** a push to `main` tests, builds and deploys whatever changed.

### Tasks
- [ ] **Create `.github/workflows/deploy.yml`**
  - Trigger: `push` to `main`, plus `workflow_dispatch` for a manual run.
- [ ] **Detect which parts changed** (e.g. with `dorny/paths-filter`)
  - `backend/**` or `docker-compose.yml` → backend job.
  - `frontend/**` → frontend job.
  - A manual run deploys both.
- [ ] **Frontend job** (no container, see the target deployment above)
  - On the GitHub runner: `npm ci`, `npm run lint`, `npm run build`. Lint is clean now, so it can block the deploy.
  - `rsync -a --delete frontend/dist/ $SSH_USER@$SSH_HOST:/srv/www/portfolio/`. `--delete` removes old hashed files, so no separate cleanup step is needed.
  - Check afterwards: `curl -fs https://vg-portfolio.duckdns.org/ | grep -q "<div id=\"root\">"`.
  - No nginx restart is needed; it serves the new files immediately.
- [ ] **Backend job**
  - Run the backend tests first. Make `backend-tests.yml` reusable (`workflow_call`) rather than copying it.
  - SSH to the server, then `git pull --ff-only` and `docker compose up -d --build portfolio-db portfolio-backend`.
  - Wait until the container reports `healthy` (the compose health check calls `/actuator/health`). If it doesn't, fail the job and print `docker logs portfolio-backend`.
  - Run `docker image prune -f` so old images don't fill the disk.
- [ ] **Add GitHub secrets**
  - `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `DEPLOY_PATH`, and optionally `SSH_PORT`.
  - Create a dedicated deploy user on the server. It needs the `docker` group (for the backend) and write access to `/srv/www/portfolio/` (for the frontend), with its own SSH key.
- [ ] **Safety**
  - Use a `concurrency` group so two deploys never run at the same time.
  - Use a GitHub `production` environment so a manual approval step can be added later.
- [ ] **Add frontend CI for PRs**
  - A `frontend-ci.yml` that runs `npm ci`, `npm run lint` and `npm run build` on PRs touching `frontend/**`. Moved here from FRONTEND.md P5.
- [ ] **Avoid running the tests twice**
  - Once `deploy.yml` tests every push to `main`, limit the CI workflows to `pull_request`.

### Notes
- **Do #3 first,** by hand. It sets up `/srv/www/portfolio/`, which the frontend job deploys to.
- **Server `.env`** (next to `docker-compose.yml`) must set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `POSTGRES_PASSWORD` and `CORS_ALLOWED_ORIGINS`. The backend refuses to start without them. See `.env.example`.
- **Database password:** before the first deploy of the current backend, either set `POSTGRES_PASSWORD=portfolio_pass` or rotate it with `ALTER USER` first (Postgres only reads `POSTGRES_PASSWORD` when the volume is first created).
- **First backend start** after these changes runs Flyway: it records the existing database as baseline V2, then applies V3 (profile). Watch the logs for `Successfully applied` and for any `Schema-validation` error.

---

## 2. README

**Current state:** there's no root README. `frontend/README.md` is the default Vite template.

**Goal:** someone new can understand, run and deploy the project from the README alone.

### Sections to write
- [ ] **Overview:** a public portfolio plus an `/admin` panel. Profile, projects, experience, education, skills, certifications and changelog are all editable.
- [ ] **Tech stack:** Java 21, Spring Boot 3.5 (Web, Data JPA, Security, Validation, Actuator), Flyway, PostgreSQL 16, React 19, TypeScript, Vite, Tailwind CSS 4, Docker Compose, nginx and GitHub Actions.
- [ ] **Architecture:** the "target deployment" diagram above.
- [ ] **Repo structure:** the folder tree with a one-line description of each folder.
- [ ] **API:** resources and endpoints; public GET vs admin writes; `/api/auth/login|me|logout` (session cookie); `/api/profile`; an example `curl`.
- [ ] **Running locally:**
  - Postgres on port `5433`
  - `backend/.env` from `backend/.env.example`, then `./mvnw spring-boot:run`
  - `npm ci && npm run dev`, with the Vite proxy handling `/api`
- [ ] **Tests:** backend `./mvnw test` (145 tests); frontend `npm run lint` and `npm run build`.
- [ ] **Environment variables:** root `.env.example` (server) and `backend/.env.example` (local dev).
- [ ] **Security notes:** session cookie (HttpOnly, SameSite=Strict), brute-force protection, and the required nginx `X-Forwarded-*` headers.
- [ ] **CI/CD:** what each workflow does, and the required secrets.
- [ ] **Deployment:** one-time server setup and the manual deploy steps from #3.

### Cleanup
- [ ] Delete `frontend/README.md`, or replace it with a short pointer to the root README.

---

## 3. Remove the frontend container

**Current state:** `portfolio-frontend` is a one-shot container. It builds the React app on the server, copies `dist/` into the `portfolio_dist` volume and exits. The shared nginx has that volume mounted at `/usr/share/nginx/html/portfolio`.

**Goal:** no frontend container. The build (on your PC now, GitHub Actions after #1) is copied into a normal folder that nginx serves.

### Repo changes
- [ ] Remove the `portfolio-frontend` service and the `dist` volume from `docker-compose.yml`. Removing them from the file doesn't delete the existing `portfolio_dist` volume on the server.
- [ ] Delete `frontend/Dockerfile` and `frontend/.dockerignore`.
- [ ] Replace `deployemnt.md` with a short `deployment.md` describing the new flow, and fix `frontend-deployemnt.md` in `.gitignore`.

### One-time server setup
- [ ] Create the folder: `sudo mkdir -p /srv/www/portfolio && sudo chown <deploy-user>: /srv/www/portfolio`.
- [ ] Copy the current site into it, so nothing breaks while switching: `docker run --rm -v portfolio_dist:/from -v /srv/www/portfolio:/to alpine cp -a /from/. /to/`.
- [ ] In the **nginx compose file** (outside this repo), change the portfolio mount
  - from `portfolio_dist:/usr/share/nginx/html/portfolio`
  - to `/srv/www/portfolio:/usr/share/nginx/html/portfolio:ro`
  - then recreate nginx **once**: `docker compose up -d nginx`.
- [ ] Check that https://vg-portfolio.duckdns.org still loads. Then, optionally, remove the old volume: `docker volume rm portfolio_dist`.

### Deploying the frontend by hand (until #1 exists)
```bash
cd frontend
npm ci && npm run build
rsync -a --delete dist/ <user>@<server>:/srv/www/portfolio/
```
No container and no nginx restart. `--delete` removes files from the previous build.

### nginx config: already correct
The portfolio block in the shared `nginx.conf` already has what the backend needs:
- `X-Forwarded-For`, for the brute-force protection to see real visitor IPs
- `X-Forwarded-Proto $scheme`, for the session cookie to get the `Secure` flag
- `try_files … /index.html`, so `/admin`, `/history` and the "Page not found" page work on refresh

`location /` stays as it is.

### Optional nginx improvements (portfolio block)
- [ ] **Caching:** cache hashed assets for a long time, and never cache `index.html`, so visitors get new versions right after a deploy:
  ```nginx
  location /assets/ {
      root /usr/share/nginx/html/portfolio;
      expires 1y;
      add_header Cache-Control "public, immutable";
  }
  location = /index.html {
      root /usr/share/nginx/html/portfolio;
      add_header Cache-Control "no-cache";
  }
  ```
- [ ] **`location /api` → `location /api/`,** so the prefix doesn't also match paths like `/apixyz`.
- [ ] **Remove** `proxy_set_header Authorization $http_authorization;` and `proxy_pass_header Authorization;`. nginx forwards `Authorization` by default, and `proxy_pass_header` only affects response headers. They're harmless, so this is optional.
- [ ] **Compression:** `gzip on; gzip_types text/css application/javascript application/json image/svg+xml;`. The 309 KB JS bundle becomes about 100 KB on the wire. Check whether the nginx image already enables it.

---

## Suggested order

1. **#3 by hand:** repo changes, the one-time server setup, and a manual frontend deploy with `rsync`. This proves the new flow works.
2. **#1 CD pipeline:** automate exactly those steps (frontend: build + `rsync`; backend: tests + SSH + `docker compose`).
3. **#2 README:** document the finished setup, including the CI/CD and deployment sections.
4. **Optional:** the nginx improvements under #3, at any time.

**Before any of this:** put the project under Git and push it to GitHub. #1 needs the repo on GitHub, and the server needs to `git pull` it.
