

import type { IMessage } from "./message.model";
import { MessageModel } from "./message.model";

export interface IConversation {
  uuid?: string;
  last_message?: IMessage;
  messages?: IMessage[];
  business_name?: string;
  name_from_user?: string
  created_at?: string
  photo_from_user?: string
}


export class ConversationModel implements IConversation {
  uuid?: string;
  last_message?: IMessage;
  messages: IMessage[] = [];
  business_name?: string;
  name_from_user?: string
  created_at?: string
  photo_from_user?: string='https://picsum.photos/1200/300?random={unique_tag}'

  constructor(data?: IConversation) {
    if (data) {
      this.uuid = data.uuid;
      this.last_message = data.last_message;
      this.business_name = data.business_name;

      if (data.messages) {
        this.messages = data.messages.map((m) => new MessageModel(m));
      }
    }
  }
  toJson(): IConversation {
    return {
      uuid: this.uuid,
      last_message: this.last_message,
      business_name: this.business_name,
      messages: this.messages.map((m) => new MessageModel(m).toJson()),
    };
  }

  getHourCreatedAt() {
    const date = new Date(this.created_at || '');
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  }
}

