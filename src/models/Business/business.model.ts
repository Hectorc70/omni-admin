import type { IBusinessCategory } from "./business-category.model";
import type { IBusinessHours } from "./business-hours.model";



export interface IBusiness {
  uuid?: string;
  name?: string;
  description?: string;
  logo?: string;
  logoFile?: FileList;
  full_address?: string;
  longitude?: number;
  latitude?: number;
  business_hours: IBusinessHours[]
}

export class BusinessModel implements IBusiness {
  uuid: string = '';
  name: string = '';
  description: string = '';
  logo: string = '';
  full_address?: string;
  longitude?: number;
  latitude?: number;

  logoFile?: FileList;
  business_hours: IBusinessHours[] = []
  category?: IBusinessCategory;
  is_24_hours: boolean = false
  constructor(data: IBusiness) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toJson() {
    return {
      name: this.name,
      logo: this.logo
    };
  }
  toFormData() {
    const formData = new FormData();

    if (this.logoFile) {
      formData.append('file_logo', this.logoFile![0]);
    }
    if (this.name) {
      formData.append('name', this.name);
    }
    if (this.description) {
      formData.append('description', this.description);
    }
    if(this.latitude){
      formData.append('latitude', this.latitude.toString());
    }
    if(this.longitude){
      formData.append('longitude', this.longitude.toString());
    }
    if(this.full_address){
      formData.append('full_address', this.full_address);
    }
    return formData
  }
}
