// api/ticketApi.ts
import {apiFetch} from '@/lib/api';

import { Ticket, Category, Device, Employee,DeviceFilter } from '@/types/ticket';

export const addTicketAdmin = async (ticket: Ticket) => {
 
  const res = await apiFetch(`/ticket`, {
    method: "POST",
 
    body: JSON.stringify(ticket),
  });
  
  if (!res.ok) {
    throw new Error('Failed to add ticket');
  }
  
  return res.json();
};

export const fetchCategories = async (): Promise<Category[]> => {

  const res = await apiFetch(`/category`, {
 
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  const json = await res.json();
  return json.data || [];
};

export const fetchDevices = async (filters?: DeviceFilter): Promise<Device[]> => {

  
  const payload = {
    filters: filters || {},
  };

  const res = await apiFetch(`/type/index`, {
    method: "POST",
 
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch devices');
  }
  
  const json = await res.json();
  return json.data || [];
};

export const fetchEmployees = async (): Promise<Employee[]> => {

  const res = await apiFetch(`/user`, {
    
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
  
  const json = await res.json();
  return json.data || [];
};





