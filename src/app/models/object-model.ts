export class ObjectModel {
  id: string;
  name: string;
  address: string;
  registrationDate: Date;
  requestsCount: number;

  constructor() {
    this.id = '';
    this.name = '';
    this.address = '';
    this.registrationDate = new Date();
    this.requestsCount = 0;
  }
}
