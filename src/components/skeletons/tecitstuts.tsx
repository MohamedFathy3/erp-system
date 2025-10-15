// utils/ticketUtils.ts

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'closed': return 'bg-green-100 text-green-800 border-green-200';
    case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'postponed': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    case 'urgent': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getDailyStatusColor = (dailyStatus: boolean | number) => {
  const isActive = typeof dailyStatus === 'boolean' ? dailyStatus : dailyStatus > 0;
  return isActive ? 'text-green-600' : 'text-red-600';
};

export const getDailyStatus = (dailyStatus: boolean | number) => {
  const isActive = typeof dailyStatus === 'boolean' ? dailyStatus : dailyStatus > 0;
  return isActive ? 'Active' : 'Inactive';
};