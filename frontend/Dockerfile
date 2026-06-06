FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM alpine:latest
WORKDIR /dist
COPY --from=build /app/dist .
CMD ["sh", "-c", "cp -r /dist/. /output/"]
