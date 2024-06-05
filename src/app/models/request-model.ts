export class RequestModel {
  id: string;
  title: string;
  description: string;
  email: string;
  submissionDate: Date;
  status: 'Pending' | 'Rejected' | 'Completed';
  objectId: string | null;

  constructor(){
    this.id = '';
    this.title = '';
    this.description = '';
    this.email = '';
    this.submissionDate = new Date();
    this.status = 'Pending';
    this.objectId = null;
  }
}
