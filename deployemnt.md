# Frontend Deployment Notes

## How it works

The frontend is **not** a running container — it's a one-shot build container that compiles the React app and copies the static files into a Docker volume (`portfolio_dist`), which nginx then serves.

```
[portfolio-frontend container]
        |
        | builds React app → /app/dist
        | copies → /dist (volume)
        ↓
[portfolio_dist volume]
        |
        ↓
[nginx] → serves to browser
```

---

## The two problems that will keep coming back

### 1. Volume mount collision

Docker mounts volumes **before** the container CMD runs. If the volume mount path and the files inside the image are at the **same path**, the volume overwrites the image files before the copy happens — so nothing gets copied.

**Wrong — causes collision:**
```dockerfile
FROM alpine:latest
WORKDIR /dist                        # files baked in here
COPY --from=build /app/dist .
CMD ["sh", "-c", "cp -r . /output/"] # volume mounts at /dist → wipes files
```

**Correct — no collision:**
```dockerfile
FROM alpine:latest
COPY --from=build /app/dist /app/dist  # files live at /app/dist
CMD ["sh", "-c", "cp -r /app/dist/. /dist/"]  # volume mounts at /dist → safe
```

The rule: **the volume mount path and the source files must be at different paths.**

### 2. Stale files in the volume

Vite hashes filenames based on content (e.g. `index-Cquh4b7b.js`). Each new build produces a new filename. Old files are **never automatically deleted** — they just accumulate in the volume. Nginx serves whatever `index.html` references, but this can cause confusion and wastes space.

**Always clear the volume before deploying a new build.**

---

## Correct deploy sequence

```bash
# 1. Clear the volume
docker run --rm -v portfolio_dist:/dist alpine sh -c "rm -rf /dist/*"

# 2. Rebuild and run the frontend container
docker compose build --no-cache portfolio-frontend && docker compose up -d portfolio-frontend

# 3. Verify the new files are in the volume
docker run --rm -v portfolio_dist:/dist alpine find /dist -type f

# 4. Verify your change is in the build (replace with your own search term)
docker run --rm -v portfolio_dist:/dist alpine grep -c "some text" /dist/assets/index-*.js
```

---

## Correct Dockerfile (final working version)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY frontend/src .
RUN npm run build

FROM alpine:latest
COPY --from=build /app/dist /app/dist
CMD ["sh", "-c", "cp -r /app/dist/. /dist/"]
```

---

## Quick sanity checks

| Check | Command |
|---|---|
| What's in the volume? | `docker run --rm -v portfolio_dist:/dist alpine find /dist -type f` |
| Is my change in the build? | `docker run --rm -v portfolio_dist:/dist alpine grep -c "some text" /dist/assets/index-*.js` |
| Did the container exit cleanly? | `docker wait portfolio-frontend` (expect `0`) |
| Run the image manually | `docker run --rm portfolio-portfolio-frontend ls -la /app/dist` |