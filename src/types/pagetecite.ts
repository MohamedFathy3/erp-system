export interface Status {
  id: number;
  status: string;
  updatedById: number;
  updatedBy: string;
  transferToId: number | null;
  transferTo: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  duration: string | null;
}

export interface Reply {
  id: number;
  user_id: number;
  name: string;
  role: string;
  ticket_id: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  job_title: string | null;
  role :string
}

export interface TicketDetails {
  id: number;
  ticketNumber: string;
  title: string;
  content: string;
  status: string;
  des: string | null;
  avatar: string;
  category: {
    id: number;
    name: string;
    time: string;
  };
  openAt: string;
  closeAt: string;
  openAtformated: string;
  closeAtformatted: string;
  postponeNote: string | null;
  priority: string;
  rating: string;
  etaTime: number;
  dailyTime: number;
  dailyStatus: boolean;
  deviceId: number | null;
  device: {name:string, type:string} | null;
  employeeId: number;
  employee: Employee;
  responsibleId: number;
  responsibleName: string;
  responsibleJobTitle: string | null;
  responsibleEmail: string;
  createdById: number;
  createdByName: string;
  statuses: Status[];
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
