// types/deviceAction.ts
export interface DeviceAction {
  device_id: number;
  employee_id?: number;   
  action_type: string;
  note: string;
  type:string
}

export interface Employee {
  id: number;
  name: string;
  email?: string;
  department?: string;
}

export interface Device {
  id: number;
  serialNumber: string;
  active: boolean;
  condition?: string; 
  warrantyExpireDate?: string;
  warrantyExpireDateFormatted?: string;
  purchaseDateFormatted?: string;
  deviceStatus?: {
    name: string;
  };
  cpu?: {
    name: string;
  };
  memory?: {
    size: number;
    type: string;
  };
  gpu?: {
    model: string;
    vram: string;
  };
  hdDriver?: {
    size: number;
    type: string;
  };
  brand?: {
    name: string;
  };
  deviceModel?: {
    name: string;
  };
  employee?: {
    name: string;
    position?: string;
    department?: string;
    company?: string;
    createdAt?: string;
    givenBy?: string;
  };
  createdBy?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}
export interface ActionType {
  id: number;
  name: string;
  requires_employee: boolean;
}