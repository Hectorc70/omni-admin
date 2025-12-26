import type { IBusinessCategory } from "./business-category.model";
import type { IBusinessHours } from "./business-hours.model";

export interface IPhone {
  id?: number;
  number_phone: string;
  name: string
}

export class PhoneModel implements IPhone {
  id?: number;
  number_phone: string = '';
  name: string = '';
  constructor(data: IPhone) {
    if (data) {
      Object.assign(this, data);
    }
  }
  toJson() {
    const data: IPhone = {
      number_phone: this.number_phone,
      name: this.name,
    };
    if (this.id !== undefined && this.id !== null && this.id !== 0) {
      data.id = this.id;
    }
    return data
  }
}

export interface IBusiness {
  uuid?: string;
  name?: string;
  description?: string;
  banner?: string;
  logo?: string;
  bannerFile?: FileList;
  logoFile?: FileList;
  email?: string;
  full_address?: string;
  phones?: IPhone[];
  longitude?: number;
  latitude?: number;
  business_hours: IBusinessHours[]
  category?: IBusinessCategory,
  is_24_hours?: boolean
}

export class BusinessModel implements IBusiness {
  uuid: string = '';
  name: string = '';
  description: string = '';
  banner: string = '';
  logo: string = '';
  email?: string;
  full_address?: string;
  phones?: IPhone[]
  longitude?: number;
  latitude?: number;

  bannerFile?: FileList;
  logoFile?: FileList;
  business_hours: IBusinessHours[] = []
  category?: IBusinessCategory;
  is_24_hours: boolean=false
  constructor(data: IBusiness) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toJson() {
    return {
      name: this.name,
      banner: this.banner,
      logo: this.logo
    };
  }
  toFormData() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('description', this.name);
    if (this.category) {
      formData.append('category', this.category.id?.toString()!);
    }
    if(this.bannerFile){
      formData.append('file_banner', this.bannerFile![0]);
    }
    if(this.logoFile){
      formData.append('file_logo', this.logoFile![0]);
    }
    return formData;
  }
  toJsonContactInfo() {
    const requestPhone: IPhone[] = []
    if (this.phones) {
      this.phones.map(phone => {
        const model = new PhoneModel(phone)
        const data = model.toJson()
        requestPhone.push(data)
      })
    }
    return {
      email: this.email,
      full_address: this.full_address,
      phones: requestPhone,
      longitude: this.longitude,
      latitude: this.latitude
    };
  }
}
