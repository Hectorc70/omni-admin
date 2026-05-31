export interface IPromotion {
  uuid?: string;
  name: string;
  description?: string;
  image?: string | null;
  imageFile?: FileList;
  start_date: string;
  end_date: string;
  is_featured?: boolean;
  is_active?: boolean;
}

export class PromotionModel implements IPromotion {
  uuid: string = '';
  name: string = '';
  description: string = '';
  image: string | null = null;
  imageFile?: FileList;
  start_date: string = '';
  end_date: string = '';
  is_featured: boolean = false;
  is_active: boolean = true;

  constructor(data: IPromotion) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toFormData() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('start_date', this.start_date);
    formData.append('end_date', this.end_date);
    formData.append('is_featured', `${this.is_featured}`);
    if (this.imageFile && this.imageFile.length > 0) {
      formData.append('file_image', this.imageFile[0]);
    }
    if (this.uuid !== undefined && this.uuid !== null && this.uuid !== '') {
      formData.append('uuid', this.uuid);
    }
    return formData
  }
}
