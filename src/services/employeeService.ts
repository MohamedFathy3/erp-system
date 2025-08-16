import { Employee } from "@/types/employee";

// Mock data - replace with actual API calls
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Tech Corp',
    branch: 'Cairo',
    country: 'Egypt',
    role: 'Admin',
    device: 'Laptop',
    issues: 2
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    company: 'Soft Inc',
    branch: 'Alexandria',
    country: 'Egypt',
    role: 'Manager',
    device: 'Laptop',
    issues: 5
  },
  // Add more mock data as needed
];

export const fetchEmployees = async (): Promise<Employee[]> => {
  // In a real app, you would fetch from your API
  // const response = await fetch('/api/employees');
  // return response.json();
  return new Promise(resolve => setTimeout(() => resolve(mockEmployees), 500));
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  // In a real app, you would send a PUT request
  // const response = await fetch(`/api/employees/${employee.id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(employee)
  // });
  // return response.json();
  return new Promise(resolve => setTimeout(() => resolve(employee), 500));
};

export const deleteEmployee = async (id: string): Promise<void> => {
  // In a real app, you would send a DELETE request
  // await fetch(`/api/employees/${id}`, { method: 'DELETE' });
  return new Promise(resolve => setTimeout(() => resolve(), 500));
};

export const addEmployee = async (employee: Omit<Employee, 'id'> & { password: string }): Promise<Employee> => {
  // In a real app, you would send a POST request
  // const response = await fetch('/api/employees', {
  //   method: 'POST',
  //   body: JSON.stringify(employee)
  // });
  // return response.json();
  
  // Mock implementation
  const newEmployee = {
    ...employee,
    id: Math.random().toString(36).substring(2, 9),
  };
  return new Promise(resolve => setTimeout(() => resolve(newEmployee), 500));
};