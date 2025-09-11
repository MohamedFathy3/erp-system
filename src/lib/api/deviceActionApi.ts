// lib/deviceActionApi.ts
import { DeviceAction, Employee, Device, ActionType } from '@/types/deviceAction';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// جلب أنواع الإجراءات
export const fetchActionTypes = async (): Promise<ActionType[]> => {
  const payload = {
    orderBy: "id",
    orderByDirection: "asc",
    perPage: 100,
    paginate: true,
    deleted: false
  };

  const data = await fetchWithAuth(`${API_URL}/category/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  return data.data || [];
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const payload = {
    orderBy: "id",
    orderByDirection: "asc",
    perPage: 100,
    paginate: true,
    deleted: false
  };

  const data = await fetchWithAuth(`${API_URL}/user/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  return data.data || [];
};

export const fetchDevices = async (): Promise<Device[]> => {
  const payload = {
    filters: { type: 'device' },
    orderBy: "id",
    orderByDirection: "asc",
    perPage: 100,
    paginate: true,
    deleted: false
  };

  const data = await fetchWithAuth(`${API_URL}/device/index`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  return data.data || [];
};

export const addDeviceAction = async (action: DeviceAction) => {
  const data = await fetchWithAuth(`${API_URL}/device/assign-action`, {
    method: 'POST',
    body: JSON.stringify(action),
  });
  
  return data.data;
};