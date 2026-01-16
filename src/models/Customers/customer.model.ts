
export interface ICustomer {
  uuid?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  is_active?: Boolean;
  type_auth?: string;
}

export class CustomerModel implements ICustomer {
  uuid: string = '';
  name: string = '';
  email: string = '';
  phone_number: string = '';
  is_active: Boolean = false;
  type_auth: string = '';
  constructor(data: ICustomer) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
