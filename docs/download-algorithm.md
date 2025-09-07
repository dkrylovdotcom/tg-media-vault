# Download Algorithm

TG Media Vault system contains two apps:

- API — reads data from telegram group
- Web — user interface for media content. Available from browsers

API uses Telegram Bot API to read media content _(Images & Video)_ from telegram group _(**Important!** - works only groups, not channels)_, where this bot is an admin.
API downloads all media content to hardware disks, connected to the computer where API is running on.

**Important**

- works only groups, not channels
- handles only messages that are sent after the bot is added

## 1. Receive Message

1. The Telegram bot receives a new message _(using existing offset)_ from a group via `onChannelMessage` _(using polling)_.
2. The raw message is transformed into a domain model (`ChannelMessageEntity`).

## 2. Validate Message

The system checks if the message contains media content (`isContentUpload`).
   - If **not**, the message is skipped and logged.

## 3. Place to Queue

The message with media content is placed to a queue that will handle each message with a delay of `QUEUE_INTERVAL` ms.  
This prevents `ETELEGRAM: 429 Too Many Requests: retry after 5`

## 4. Save to DB

1. The repository is queried (`contentRepository.findOne(message_id)`) to check if this message has already been processed.
   - If **already exists**, the message is skipped to avoid duplicates.
2. A new `ContentItemEntity` is instantiated using `ContentItemEntity.create(...)`.
3. Message offset, Channel ID, user ID, message ID, and the `ChannelMessageEntity` are stored inside the entity.
4. The entity is persisted to the database (`contentRepository.save`).

## 5. Download Directory Resolution

1. The base downloads directory is read from configuration (`downloadsDir`).
2. The channel name is sanitized into a filesystem-safe format (`sanitizeChannelName`).
3. A hierarchical path is built in the format:
   ```
   /<downloadsDir>/<channel_name>/<videos|images>/<year>/<month>
   ```
   - `videos` if the message contains video
   - `images` if the message contains photo
4. The directory is created if it does not already exist (`createDirectoryIfNotExists`).

## 6. File Download

1. The file identifier (`fileId`) and file name are extracted from `ChannelMessageEntity`.
2. The file is downloaded via `botProvider.downloadFile(fileId, downloadsDir, fileName)` into the resolved directory.
   - Download will be executed using `downloadWithRetry` logic, that is trying to retry download if `Too Many Requests` error happened
3. On successful download:
   - `contentItem.downloadSuccess(src)` is called with the local file path.
   - A success log entry is created.
   - An acknowledgment reaction is sent back to the channel (`botProvider.sendOkReaction`).

## 7. Error Handling

1. If an error occurs during download:
   - `contentItem.downloadFail(error)` is called with error details.
   - A failure log entry is created.
2. In all cases (`finally` block), the updated entity is persisted again to ensure consistent state.

## 8. Final State

- All valid media messages are persisted in the database - and stored on disk.
- Each message is processed exactly once - (deduplication by `message_id`).
- Files are stored in a structured directory hierarchy, like:
```
downloads/
  └── my_channel/
      └── videos/
            └── 2025/
                └── 8/
                      └── file.mp4
```
