
export interface IMessage {
  uuid?: string;
  message?: string;
  file?: string;
  created_at?: string;
  user_uuid?: string
}

export class MessageModel implements IMessage {
  uuid?: string;
  message?: string;
  file?: string;
  created_at?: string;
  user_uuid?: string

  constructor(data?: IMessage) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toJson(): IMessage {
    return {
      uuid: this.uuid,
      message: this.message,
      file: this.file,
      created_at: this.created_at,
      user_uuid: this.user_uuid
    };
  }
  getHourCreatedAt() {
    const date = new Date(this.created_at || '');
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  }
}