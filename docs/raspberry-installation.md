# Run the TG Media Vault on Raspberry Pi

This is my hardware installation of the TG Media Vault:

- Raspberry Pi 3
- WD HDD 1TB

<img src="./images/raspberry-installation.jpg" width="500"/>

## Install git

```bash
sudo apt update && sudo apt install -y git
```

## Clone TG Media Vault

```bash
git clone https://github.com/dkrylovdotcom/tg-media-vault
```

### Create env file

1. Create env file:

```bash
touch ./tg-media-vault/apps/api/.env
```

2. Fill the file:

```bash
nano ./tg-media-vault/apps/api/.env
```

```
# App info
APP_DIR=/home/pi/tg-media-vault/apps/api
APP_NAME=tg-media-vault-api

# Node.js env
NODE_ENV=production

# Telegram connection config
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_ID=

# PostgreSQL connection
PG_CONNECTION_URL=postgresql://postgres:postgres@localhost/postgres?schema=public

# Media content downloads directory
DOWNLOAD_DIRECTORY_PATH=/media/pi/wd-disk
```

## Mount NTFS disk

Mounts NTFS disk to a linux filesystem, that is prevents `EACCESS` error:

```
npm ERR! code EACCES
npm ERR! syscall mkdir
```

```bash
chmod +x ./tg-media-vault/scripts/mount-nfts-disk.sh && ./tg-media-vault/scripts/mount-nfts-disk.sh
```

This script will mount HDD to `MOUNT_POINT="/media/pi/wd-disk"`

## Run Postgres

Runs Postgres database

```bash
chmod +x ./tg-media-vault/scripts/run-postgres.sh && ./tg-media-vault/scripts/run-postgres.sh
```

## Run TG Media Vault system

There are a few things that this shell scripts will do:
- Update OS packages
- Install [NodeJS](https://nodejs.org/en)
- Install [NestJS CLI](https://nestjs.com/)
- Install [PM2](https://pm2.keymetrics.io/)
- Install [npm](https://www.npmjs.com/) dependencies
- Migrate database schema _(using [Prisma](https://www.prisma.io/))_
- Configures application autostartup using [systemctl](https://man7.org/linux/man-pages/man1/systemctl.1.html)

```bash
chmod +x ./tg-media-vault/scripts/run-app.sh && ./tg-media-vault/scripts/run-app.sh
```

## Manage app through PM2

```
# View process list
pm2 ls

# Application logs
pm2 logs tg-media-vault-api

# Restart
pm2 restart tg-media-vault-api

# Stop
pm2 stop tg-media-vault-api

# Remove from pm2
pm2 delete tg-media-vault-api
```
