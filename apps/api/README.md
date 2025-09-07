# TG Media Vault API

## Description

TG Media Vault API saves & provides access to the downloaded media content.

TG Media Vault API using NestJS framework.

## Required environment variables

| Environment variable name             | Purpose                                                                    | Sample value                                                               |
|---------------------------------------|----------------------------------------------------------------------------|----------------------------------------------------------------------------|
| [`ENABLE_DB_LOG`]                     | Enables verbose logging for the DB requests                                | `true/false/empty`                                                         |
| [`GLOBAL_ENDPOINT_PREFIX`]            | API endpoints prefix                                                       | `api`                                                                      |
| [`PG_CONNECTION_URL`]                 | DB connection URL                                                          | `postgresql://postgres:postgres@localhost/postgres?schema=public`          |
| [`TELEGRAM_BOT_TOKEN`]                | Bot token from @Botfather                                                  | `<BOT_TOKEN>`                                                              |
| [`TELEGRAM_CHANNEL_ID`]               | Channel ID                                                                 | `-1234567890`                                                              |
| [`DOWNLOAD_DIRECTORY_PATH`]           | Root directory for media files downloads                                   | `/media/pi/wd-disk`                                                        |
| [`DOWNLOAD_ENDPOINT`]                 | Media content endpoint                                                     | `/downloads` (default)                                                     |
| [`QUEUE_INTERVAL`]                    | Delay between telegram messages handle in ms                               | `2000` (default)                                                           |

## Media Content Endpoint Access

`/<DOWNLOAD_ENDPOINT>` endpoint used to provide http access to downloaded media content in the UI

## Database

The TG Media Vault API uses Prisma ORM and PostgeSQL.

To generate schema & push it to DB run:

```bash
$ npm run db:reset
```

## Running the app

Start dev server:

```bash
$ npm run start:dev
```

## Test

1) In app commands:

```bash
# unit tests
$ npm run test
```

## Troubleshooting

### Database

Set environment variable `ENABLE_DB_LOG` = `true`. Run `npm run start:dev > db.log` to write to a file
