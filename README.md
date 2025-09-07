# TG Media Vault

The TG Media Vault is a system that saves your media content _(images & videos)_ from telegram group, where the telegram bot is joined in.
The system provides a web interface to show your media content in a browser.

## Why the TG Media Vault?

All of us have smartphones that is used to create important photos & videos that represents our long-life memory.
The smartphones has limited storage space. The smartphones could be broken by any reasons. The smartphones are getting old, and when it happens we need to save our media content to not lose it.

## Why to not use a public cloud?

- The public cloud may have no access without the internet connection or government restrictions.
- The public cloud storage is a shareware/freemium — "Use only 5GB of the storage free, if you want more just pay us"
- Telegram offers unlimited cloud storage for all users, meaning you can store as many files as you want, as long as they are below the per-file size limit.
- There's a 2GB file size limit per file for regular users, and Telegram Premium users can send files up to 4GB. _(actual for 2025 year)_
- Telegram is a familiar way of sending media content not only to the younger, but also to older generation _(parents / grandparents)_

The TG Media Vault system is cost saving approach that is using both of the public & private storage advantages by storing media content in the Telegram & hardware storage.
The presence of two distributed storage locations increases the likelihood of continuous data availability in the event of a failure of one node.

BTW, if you need an additional layer of storage resilience, you may use some solution to make copies, like [rsync](https://linux.die.net/man/1/rsync).

## Restrictions

- Currently, the only Telegram Bot Provider is implemented. Bots may download files that are less then 20MB. _(see TODOs section)_.

## Technologies

- TypeScript
- NodeJS / NestJS
- PostgreSQL
- PrismaORM
- ReactJS

## Documentation

- [Download algorithm](./docs/download-algorithm.md)
- [Run the TG Media Vault on Raspberry Pi](./docs/raspberry-installation.md)

## Run locally

### 1. Configure Bot & Group

1. Create bot using @BotFather
2. Create **group** in telegram _(**Important!** works only groups, not channels)_
3. Add bot to the created group

### 2. Run Postgres

1. Run Postgres via `docker-compose.yaml`
```
docker compose up postgres -d
```

### 3. Run API

[Go to TG Media Vault API README.md](./apps/api/README.md)

### 4. Run UI

[Go to TG Media Vault WEB README.md](./apps/api/README.md)

## TODOs

1. Implement error logging
2. Implement Telegram MTProto Provider to avoid Telegram Bot API 20MB item download limit.
