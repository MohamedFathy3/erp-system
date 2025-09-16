
import toast from 'react-hot-toast';

interface FetchOptions extends RequestInit {
  showToast?: boolean;
  customErrorMessage?: string;
}
import { Device, Brand, DeviceModel, Processor, GraphicCard, Memory, StorageItem, DeviceStatus, } from '@/types/device';
import { Employee } from '@/types/deviceAction';

interface FetchDeviceModelsParams {
  brandId?: number;
}
interface errors{
  name:string;
  message:string
  
}
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


const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiPayload {
  filters?: DeviceModelFilters;
  orderBy: string;
  orderByDirection: string;
  perPage: number;
  paginate: boolean;
  deleted: boolean;
}





const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
  const {
    showToast = true,
    customErrorMessage,
    ...fetchOptions
  } = options;

  const token = localStorage.getItem('token');
  
  if (!token && showToast) {
    toast.error( 'Please log in new');
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = customErrorMessage || `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
      
      }
      
      if (showToast) {
        toast.error(errorMessage);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: unknown) {
  if (showToast) {
    if (error instanceof TypeError || (error instanceof Error && error.message.includes('Network'))) {
      toast.error('Server connection error. Please check your internet connection.');
    } else if (error instanceof Error && error.message) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred.');
    }
  }
  throw error;
}
};
const createStandardPayload = (filters?: DeviceModelFilters): ApiPayload => ({
  filters: filters || {},
  orderBy: "id",
  orderByDirection: "asc",
  perPage: 300,
  paginate: true,
  deleted: false,
});



export const addDevice = async (device: Device) => {
  return fetchWithAuth(`${API_URL}/device`, {
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

  const data = await fetchWithAuth(`${API_URL}/type/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data.data.map((item: Device) => item.name);
};

export const fetchBrands = async (): Promise<Brand[]> => {
  const payload = createStandardPayload();
  const data = await fetchWithAuth(`${API_URL}/brand/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchDeviceModels = async (brandId?: number): Promise<DeviceModel[]> => {
  const filters = brandId ? { brand_id: brandId } : {};
  const payload = createStandardPayload(filters);
  
  const data = await fetchWithAuth(`${API_URL}/device-model/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  console.log('Device models response:', data);
  return data.data || [];
};

export const fetchProcessors = async (): Promise<Processor[]> => {
  const payload = createStandardPayload();
  const data = await fetchWithAuth(`${API_URL}/processor/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchGraphicCards = async (): Promise<GraphicCard[]> => {
  const payload = createStandardPayload();
  const data = await fetchWithAuth(`${API_URL}/graphic-card/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchMemories = async (): Promise<Memory[]> => {
  const payload = createStandardPayload();
  const data = await fetchWithAuth(`${API_URL}/memory/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchStorages = async (): Promise<StorageItem[]> => {
  const payload = createStandardPayload();
  const data = await fetchWithAuth(`${API_URL}/storage/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchDeviceStatuses = async (): Promise<DeviceStatus[]> => {
  const payload = createStandardPayload();
  const data = await fetchWithAuth(`${API_URL}/device-status/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const payload = createStandardPayload();
  const data = await fetchWithAuth(`${API_URL}/user/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data || [];
};

export const addBrand = async (name: string): Promise<Brand> => {
  const data = await fetchWithAuth(`${API_URL}/brand`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return data.data;
};

export const addDeviceModel = async (name: string, ): Promise<DeviceModel> => {
  const data = await fetchWithAuth(`${API_URL}/device-model`, {
    method: 'POST',
    body: JSON.stringify({ name, }),
  });
  return data.data;
};

export const addProcessor = async (name: string): Promise<Processor> => {
  const data = await fetchWithAuth(`${API_URL}/processor`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return data.data;
};

export const addGraphicCard = async (model: string, vram: string): Promise<GraphicCard> => {
  const data = await fetchWithAuth(`${API_URL}/graphic-card`, {
    method: 'POST',
    body: JSON.stringify({ model, vram }),
  });
  return data.data;
};

export const addMemory = async (size: string, type: string): Promise<Memory> => {
  const data = await fetchWithAuth(`${API_URL}/memory`, {
    method: 'POST',
    body: JSON.stringify({ size, type }),
  });
  return data.data;
};

export const addStorage = async (size: number, type: string): Promise<StorageItem> => {
  const data = await fetchWithAuth(`${API_URL}/storage`, {
    method: 'POST',
    body: JSON.stringify({ size, type }),
  });
  return data.data;
};


export const updateDevice = async (id: number, device: Device) => {
  return fetchWithAuth(`${API_URL}/device/${id}`, {
    method: 'PUT',
    body: JSON.stringify(device),
  });
};