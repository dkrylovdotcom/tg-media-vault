import type { Message, User, Animation, Audio, Chat, ChatShared, Contact, Dice, Document, ForumTopicClosed, ForumTopicCreated, ForumTopicEdited, ForumTopicReopened, Game, GeneralForumTopicHidden, GeneralForumTopicUnhidden, InlineKeyboardMarkup, Invoice, Location, MessageEntity, PassportData, PhotoSize, Poll, Sticker, SuccessfulPayment, UserShared, Venue, VideoNote, Voice, WebAppData } from 'node-telegram-bot-api';
import { TelegramChannelMessage, TelegramChannelMessageVideo } from '../interfaces/channel-message.interface';
import { Expose } from 'class-transformer';

export class ChannelMessageEntity {
  @Expose()
  from: User;

  @Expose()
  video: TelegramChannelMessageVideo | undefined;

  @Expose()
  message_id: number;

  @Expose()
  message_thread_id?: number | undefined;

  @Expose()
  date: number;

  @Expose()
  chat: Chat;

  @Expose()
  sender_chat?: Chat | undefined;

  @Expose()
  forward_from?: User | undefined;

  @Expose()
  forward_from_chat?: Chat | undefined;

  @Expose()
  forward_from_message_id?: number | undefined;

  @Expose()
  forward_signature?: string | undefined;

  @Expose()
  forward_sender_name?: string | undefined;

  @Expose()
  forward_date?: number | undefined;

  @Expose()
  is_topic_message?: boolean | undefined;

  @Expose()
  reply_to_message?: Message | undefined;

  @Expose()
  edit_date?: number | undefined;

  @Expose()
  media_group_id?: string | undefined;

  @Expose()
  author_signature?: string | undefined;

  @Expose()
  text?: string | undefined;

  @Expose()
  entities?: MessageEntity[] | undefined;

  @Expose()
  caption_entities?: MessageEntity[] | undefined;

  @Expose()
  audio?: Audio | undefined;

  @Expose()
  document?: Document | undefined;

  @Expose()
  animation?: Animation | undefined;

  @Expose()
  game?: Game | undefined;

  @Expose()
  photo?: PhotoSize[] | undefined;

  @Expose()
  sticker?: Sticker | undefined;

  @Expose()
  voice?: Voice | undefined;

  @Expose()
  video_note?: VideoNote | undefined;

  @Expose()
  caption?: string | undefined;

  @Expose()
  contact?: Contact | undefined;

  @Expose()
  location?: Location | undefined;

  @Expose()
  venue?: Venue | undefined;

  @Expose()
  poll?: Poll | undefined;

  @Expose()
  new_chat_members?: User[] | undefined;

  @Expose()
  left_chat_member?: User | undefined;

  @Expose()
  new_chat_title?: string | undefined;

  @Expose()
  new_chat_photo?: PhotoSize[] | undefined;

  @Expose()
  delete_chat_photo?: boolean | undefined;

  @Expose()
  group_chat_created?: boolean | undefined;

  @Expose()
  supergroup_chat_created?: boolean | undefined;

  @Expose()
  channel_chat_created?: boolean | undefined;

  @Expose()
  migrate_to_chat_id?: number | undefined;

  @Expose()
  migrate_from_chat_id?: number | undefined;

  @Expose()
  pinned_message?: Message | undefined;

  @Expose()
  invoice?: Invoice | undefined;

  @Expose()
  successful_payment?: SuccessfulPayment | undefined;

  @Expose()
  connected_website?: string | undefined;

  @Expose()
  passport_data?: PassportData | undefined;

  @Expose()
  reply_markup?: InlineKeyboardMarkup | undefined;

  @Expose()
  web_app_data?: WebAppData | undefined;

  @Expose()
  is_automatic_forward?: boolean | undefined;

  @Expose()
  has_protected_content?: boolean | undefined;

  @Expose()
  dice?: Dice | undefined;

  @Expose()
  forum_topic_created?: ForumTopicCreated | undefined;

  @Expose()
  forum_topic_edited?: ForumTopicEdited | undefined;

  @Expose()
  forum_topic_closed?: ForumTopicClosed | undefined;

  @Expose()
  forum_topic_reopened?: ForumTopicReopened | undefined;

  @Expose()
  general_forum_topic_hidden?: GeneralForumTopicHidden | undefined;

  @Expose()
  general_forum_topic_unhidden?: GeneralForumTopicUnhidden | undefined;

  @Expose()
  has_media_spoiler?: boolean | undefined;

  @Expose()
  user_shared?: UserShared | undefined;

  @Expose()
  chat_shared?: ChatShared | undefined;

  constructor(data: TelegramChannelMessage) {
    Object.assign(this, data);
  }

  public getUsername(): string {
    if (this.from.username) {
      return this.from.username;
    }

    let username = this.from.first_name;
    if (this.from.last_name) {
      username = `${username}_${this.from.last_name}`;
    }

    return username;
  }

  public getChannelName(): string {
    return this.chat.title || 'Unknown ChannelName';
  }

  public isVideo(): boolean {
    if (this.video) {
      return true;
    }
    if (this.document) {
      return !!this.document.mime_type?.startsWith("video/");
    }

    return false;
  }

  public isImage(): boolean {
    if (this.photo) {
      return true;
    }
    if (this.document) {
      return !!this.document.mime_type?.startsWith("image/");
    }

    return false;
  }
}
