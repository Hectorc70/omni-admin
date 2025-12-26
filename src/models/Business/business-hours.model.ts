export interface IBusinessHours {
  id?: number
  day_number: number;
  day_name: string;
  open_hour?: string
  closed_hour?: string
}


export class BusinessHoursModel implements IBusinessHours {
  id?: number
  day_number: number = 0
  day_name: string = ''
  open_hour?: string
  closed_hour?: string

  constructor(data: IBusinessHours) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toJson() {
    const data = {
      id: this.id,
      open_hour: this.open_hour === '' ? null : this.open_hour,
      closed_hour: this.closed_hour === '' ? null : this.closed_hour,
    };
    return data
  }
}
