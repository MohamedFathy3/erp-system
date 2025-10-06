// types/ticket.ts
export interface Ticket {
  title: string;
  content: string;
  status: string;
  priority: string;
  openAt: string;
  category?: { name: string };
  employee?: { name: string };
  company?: string;
  dailyStatus: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface company{
  id:number,
  name:string,
  phone:string,
}
export interface Device {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
}


export interface DeviceFilter {
  employee_id?: number;
  device_id?: number;
  type?: string;
}

export interface Device {
  id: number;
  name: string;
  type: string;
  employee_id?: number;
  employee_name?: string;
}

export interface storage{
  id:number;
  type:string;
  size:string;
}



