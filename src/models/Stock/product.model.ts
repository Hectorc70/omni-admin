

export interface IProduct {
  uuid?: string
  name?: string;
  description?: string;
  images_product?: IProductImage[];
  imagesFile?: FileList;
  stock?: number;
  price?: number;
  type: number
}

export class ProductModel implements IProduct {
  uuid?: string;
  name: string = '';
  description: string = '';
  images_product: IProductImage[] = [];
  imagesFile?: FileList;
  stock: number = 0;
  price: number = 0;
  type: number = 1;
  constructor(data: IProduct) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toJson() {
    const data: IProduct = {
      name: this.name,
      description: this.description,
      stock: this.stock,
      price: this.price,
      type: this.type
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