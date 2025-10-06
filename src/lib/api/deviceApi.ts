
import { apiFetch } from '@/lib/api';
interface FetchOptions extends RequestInit {
  showToast?: boolean;
  customErrorMessage?: string;
}
import { Device, Brand, DeviceModel, Processor, GraphicCard, Memory, StorageItem, DeviceStatus, } from '@/types/device';
import { Employee } from '@/types/deviceAction';



interface DeviceModelFilters {
  brand_id?: number;
}

interface DeviceModelPayload {
  filters?: DeviceModelFilters;
  orderBy: string;
  orderByDirection: string;
  perPage: number;
  paginate: boolean;
  deleted: boolean;
}



interface ApiPayload {
  filters?: DeviceModelFilters;
  orderBy: string;
  orderByDirection: string;
  perPage: number;
  paginate: boolean;
  deleted: boolean;
}






const createStandardPayload = (filters?: DeviceModelFilters): ApiPayload => ({
  filters: filters || {},
  orderBy: "id",
  orderByDirection: "desc",
  perPage: 300,
  paginate: true,
  deleted: false,
});



export const addDevice = async (device: Device) => {
  return apiFetch(`/device`, {
    method: 'POST',
    body: JSON.stringify(device),
  });
};

export const fetchDeviceTypes = async (): Promise<string[]> => {
  const payload = {
    filters: {type:'device'},
    orderBy: "id",
    orderByDirection: "asc",
    perPage: 100,
    paginate: true,
    deleted: false
  };

  const data = await apiFetch(`/type/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data.data.map((item: Device) => item.name);
};

export const fetchBrands = async (): Promise<Brand[]> => {
  const payload = createStandardPayload();
  const data = await apiFetch(`/brand/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchDeviceModels = async (brandId?: number): Promise<DeviceModel[]> => {
  const filters = brandId ? { brand_id: brandId } : {};
  const payload = createStandardPayload(filters);

  const data = await apiFetch(`/device-model/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  console.log('Device models response:', data);
  return data.data || [];
};

export const fetchProcessors = async (): Promise<Processor[]> => {
  const payload = createStandardPayload();
  const data = await apiFetch(`/processor/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchGraphicCards = async (): Promise<GraphicCard[]> => {
  const payload = createStandardPayload();
  const data = await apiFetch(`/graphic-card/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchMemories = async (): Promise<Memory[]> => {
  const payload = createStandardPayload();
  const data = await apiFetch(`/memory/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchStorages = async (): Promise<StorageItem[]> => {
  const payload = createStandardPayload();
  const data = await apiFetch(`/storage/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchDeviceStatuses = async (): Promise<DeviceStatus[]> => {
  const payload = createStandardPayload();
  const data = await apiFetch(`/device-status/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const payload = createStandardPayload();
  const data = await apiFetch(`/user/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const addBrand = async (name: string): Promise<Brand> => {
  const data = await apiFetch(`/brand`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return data.data;
};

export const addDeviceModel = async (name: string, brandId: number): Promise<DeviceModel> => {
  const data = await apiFetch(`/device-model`, {
    method: 'POST',
    body: JSON.stringify({ name, brandId }),
  });
  return data.data;
};

export const addProcessor = async (name: string): Promise<Processor> => {
  const data = await apiFetch(`/processor`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return data.data;
};

export const addGraphicCard = async (model: string, vram: string): Promise<GraphicCard> => {
  const data = await apiFetch(`/graphic-card`, {
    method: 'POST',
    body: JSON.stringify({ model, vram }),
  });
  return data.data;
};

export const addMemory = async (size: string, type: string): Promise<Memory> => {
  const data = await apiFetch(`/memory`, {
    method: 'POST',
    body: JSON.stringify({ size, type }),
  });
  return data.data;
};

export const addStorage = async (size: number, type: string): Promise<StorageItem> => {
  const data = await apiFetch(`/storage`, {
    method: 'POST',
    body: JSON.stringify({ size, type }),
  });
  return data.data;
};


export const updateDevice = async (id: number, device: Device) => {
  return apiFetch(`/device/${id}`, {
    method: 'PUT',
    body: JSON.stringify(device),
  });
};