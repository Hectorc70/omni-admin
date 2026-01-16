
export interface INotificationTemplate {
  uuid?: string;
  name_template?: string;
  title?: string;
  body?: string;
  image?: string;
  image_file?: FileList;
  is_active?: Boolean;
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
  image_file?: FileList | undefined;
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
    if (this.image_file) {
      formData.append('image_file', this.image_file![0]);
    }
    return formData;
  }
}
