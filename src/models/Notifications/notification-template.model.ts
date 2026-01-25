
export interface INotificationTemplate {
  uuid?: string;
  name_template?: string;
  title?: string;
  body?: string;
  image?: string;
  file?: FileList;
  is_active?: Boolean;
  date_schedule?: string;
  type_notification_device?: string;
}

export class NotificationTemplateModel implements INotificationTemplate {
  uuid: string = '';
  name_template: string = '';
  title: string = '';
  body: string = '';
  image: string = '';
  is_active: Boolean = false;
  type_notification_device: string = '';
  date_schedule: string = '';
  file?: FileList | undefined;
  constructor(data: INotificationTemplate) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toFormData() {
    const formData = new FormData();
    formData.append('name_template', this.name_template);
    formData.append('body', this.body);
    formData.append('title', this.title);
    formData.append('type_notification_device', this.type_notification_device);
    if(this.date_schedule){
      formData.append('date_schedule', this.date_schedule);
    }
    if (this.file) {
      formData.append('file', this.file![0]);
    }
    return formData;
  }
}
