export interface Employee {
  id: string;
  name: string;
  email: string;
  company: string;
  branch: string;
  country: string;
  role: string;
  device: 'Laptop' | 'Mobile' | 'Server';
  issues: number;
}