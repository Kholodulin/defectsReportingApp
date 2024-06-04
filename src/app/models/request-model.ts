export class RequestModel {
  id: number;
  title: string;
  description: string;
  email: string;
  submissionDate: Date;
  status: 'Pending' | 'Rejected' | 'Completed';
  objectId: number;

  constructor(){
    this.id = NaN;
    this.title = '';
    this.description = '';
    this.email = '';
    this.submissionDate = new Date();
    this.status = 'Pending';
    this.objectId = NaN;
  }
}
