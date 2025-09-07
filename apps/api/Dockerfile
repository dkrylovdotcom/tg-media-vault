FROM node:18-alpine as build

# Install system dependencies
RUN apk update && \
    apk --no-cache add ca-certificates

# It is necessary only for install npm dependencies from git
RUN apk add --no-cache git

WORKDIR /usr/src/tg-media-vault

# Build project
COPY package-lock.json package.json ./
COPY apps/api/db/schema.prisma apps/api/db/schema.prisma
COPY apps/api/package.json apps/api/package.json

RUN npm set audit false && \
    npm ci -w @tg-media-vault/api --ignore-scripts --verbose && \
    npm i -D prettier

COPY apps/api apps/api

WORKDIR /usr/src/tg-media-vault/apps/api

RUN npx prisma generate && npm run build -- --tsc

RUN npm prune --omit=dev

FROM node:18-alpine

WORKDIR /usr/src/tg-media-vault/apps/api

COPY --from=build /usr/src/tg-media-vault/apps/api .

CMD npm run -w @tg-media-vault/api start:prod
