export interface IEvent {
  uuid?: string;
  name: string;
  description?: string;
  image?: string | null;
  imageFile?: FileList;
  date_time_start: string;
  is_active?: boolean;
}

export class EventModel implements IEvent {
  uuid: string = '';
  name: string = '';
  description: string = '';
  image: string | null = null;
  imageFile?: FileList;
  date_time_start: string = '';
  is_active: boolean = true;

  constructor(data: IEvent) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toJson() {
    const data: IEvent = {
      name: this.name,
      description: this.description,
      image: this.image,
      date_time_start: this.date_time_start,
      is_active: this.is_active,
    };
    if (this.uuid !== undefined && this.uuid !== null && this.uuid !== '') {
      data.uuid = this.uuid;
    }
    return data
  }

  toFormData() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('date_time_start', this.date_time_start);
    if (this.imageFile && this.imageFile.length > 0) {
      formData.append('file_image', this.imageFile[0]);
    }
    if (this.uuid !== undefined && this.uuid !== null && this.uuid !== '') {
      formData.append('uuid', this.uuid);
    }
    return formData
  }
}
