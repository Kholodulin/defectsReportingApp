export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: 'Manager' | 'User';
}
