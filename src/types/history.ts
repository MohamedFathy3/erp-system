// types/history.ts
export interface HistoryRecord {
  id: number;
  action_type: string;
  note: string;
  help_desk_name?: string;
  employee_name?: string;
  createdAt: string;
}

export interface Employee {
  id: number;
  name: string;
}

export interface FilterOptions {
  dateFrom?: string;
  dateTo?: string;
  employeeId?: string;
  category?: string;
}