export interface Device {
  id?: number;
  name: string;
  type: string;
  serialNumber: string;
  condition: string;  // ensure this is defined correctly
  note: string;
  purchaseDate: string;
  warrantyExpireDate: string;
  memoryId?: number;
  graphicCardId?: number;
  processorId?: number;
  brandId?: number;
  device_status_id: number;
  employee?: number;
  deviceModelId?: number;
  storages: Storage[];
  active: number;
  userId?: number;
  companyId?: number;
  deviceStatus?: number;
  deviceModel?: DeviceModel;
  brand?: Brand;
  processor?: Processor;
  graphicCard?: GraphicCard;
  memory?: Memory;
  memoryType?: string;
  warrantyExpireDateFormatted: string;
  purchaseDateFormatted: string;
}


export interface Storage {
  type: string;
  storageId: number;
}

export interface Brand {
  id: number;
  name: string;
}

export interface DeviceModel {
  id: number;
  name: string;
  brandId: number;
}

export interface Processor {
  id: number;
  name: string;
}

export interface GraphicCard {
  id: number;
  model: string;
  varm:number;
}

export interface Memory {
  id: number;
  size: string;
  type: string;
}

export interface StorageItem {
  id: number;
  size: number;
  type: string;
}

export interface DeviceStatus {
  id: number;
  name: string;
}