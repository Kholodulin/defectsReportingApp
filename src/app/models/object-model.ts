export class ObjectModel {
  id: number;
  name: string;
  address: string;
  registrationDate: Date;
  requestsCount: number;

  constructor() {
    this.id = 0;
    this.name = '';
    this.address = '';
    this.registrationDate = new Date();
    this.requestsCount = 0;
  }
}
