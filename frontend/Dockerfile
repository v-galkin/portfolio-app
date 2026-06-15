FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM alpine:latest
COPY --from=build /app/dist /app/dist
CMD ["sh", "-c", "cp -r /app/dist/. /dist/"]