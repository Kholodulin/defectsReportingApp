export interface RequestModel {
  id: string;
  title: string;
  description: string;
  email: string;
  submissionDate: Date;
  status: 'Pending' | 'Rejected' | 'Completed';
  objectId: string;
  attachedFilesId: string | null;
}
