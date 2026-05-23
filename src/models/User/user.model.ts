import type { IBusiness } from "../Business/business.model";

// Interfaz para el módulo
export interface IModule {
  id:number
  name: string;
  label: string;
  route: string;
}

export interface IUser {
  uuid: string;
  username: string;
  first_name: string;
  email: string;
  active: boolean;
  external_id: string;
  modules: IModule[];
  business?: IBusiness;
  access_token?: string;
}

export class UserModel implements IUser {
  uuid: string = '';
  first_name: string = '';
  active: boolean=true;
  username: string = '';
  email: string='';
  external_id: string = '';
  modules: IModule[] = [];
  external_token: string='';
  business?: IBusiness;
  access_token?: string;

  constructor(data: IUser) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toJson () {
    return {
      first_name: this.first_name,
      email: this.email,
      external_id: this.external_id,
      modules: this.modules,
      external_token: this.external_token
    };
  }
}
