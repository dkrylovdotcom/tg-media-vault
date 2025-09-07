FROM node:18-alpine as build

ARG VITE_API_URL

# It is necessary only for install npm dependencies from git
RUN apk add --no-cache git

WORKDIR /usr/src/tg-media-vault

COPY .prettierrc package-lock.json package.json ./
COPY apps/web/package.json apps/web/package.json

RUN npm set audit false && npm ci

COPY apps/web apps/web

ARG NODE_ENV

RUN npm run -w @tg-media-vault/web build

FROM nginx:1.24.0

RUN rm -rf /usr/share/nginx/html/*

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/tg-media-vault/apps/web/dist /usr/share/nginx/html
