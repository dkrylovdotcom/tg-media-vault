import { Video, Message, User } from "node-telegram-bot-api";

// NOTE:: Fix for non defined types
export interface TelegramChannelMessageVideo extends Video {
  file_name: string;
}

export interface TelegramChannelMessage extends Message {
  from: User;
  video: TelegramChannelMessageVideo | undefined;
}
