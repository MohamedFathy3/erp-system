// api/ticketApi.ts
import { Ticket, Category, Device, Employee,DeviceFilter } from '@/types/ticket';

export const addTicketAdmin = async (ticket: Ticket) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(ticket),
  });
  
  if (!res.ok) {
    throw new Error('Failed to add ticket');
  }
  
  return res.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  const json = await res.json();
  return json.data || [];
};

export const fetchDevices = async (filters?: DeviceFilter): Promise<Device[]> => {
  const token = localStorage.getItem('token');
  
  const payload = {
    filters: filters || {},
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type/index`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch devices');
  }
  
  const json = await res.json();
  return json.data || [];
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
  
  const json = await res.json();
  return json.data || [];
};





