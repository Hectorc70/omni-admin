export interface IBusinessProduct {
  uuid?: string;
  name?: string;
  description?: string;
  type_product?: number;
  stock?: number;
  price?: number;
  currency?: string;
  category?: string;
  business?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  deleted_at?: string | null;
  imagesFile?: FileList;
  images_product?: IProductImage[];
}

export class BusinessProductModel implements IBusinessProduct {
  uuid: string = '';
  name: string = '';
  description: string = '';
  type_product: number = 1;
  stock: number = 0;
  price: number = 0;
  currency: string = 'USD';
  category: string = '';
  business: string = '';
  created_at: string = '';
  updated_at: string = '';
  is_active: boolean = true;
  deleted_at: string | null = null;
  imagesFile?: FileList
  images_product?: IProductImage[] | undefined;
  constructor(data: IBusinessProduct) {
    if (data) {
      Object.assign(this, data);
    }
  }
  toJson() {
    const data: IBusinessProduct = {
      name: this.name,
      description: this.description,
      stock: this.stock,
      price: this.price,
      type_product: this.type_product,
      category: this.category
    };
    if (this.uuid !== undefined && this.uuid !== null && this.uuid !== '') {
      data.uuid = this.uuid;
    }
    return data
  }
}


export interface IProductImage {
  id?: number;
  image?: string;
}
