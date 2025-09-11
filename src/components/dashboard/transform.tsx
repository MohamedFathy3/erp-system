'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Edit, User, Loader2 } from 'lucide-react';
type ItemData = Record<string, string | number | boolean>; 

interface Employee {
  id: number;
  name: string;
  email: string;
  job_title: string | null;
  role: string;
}

interface StatusUpdateProps {
  ticketId: string;
  currentStatus: string;
  currentResponsibleId?: number;
}

async function fetchEmployees(): Promise<Employee[]> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }

  const result = await response.json();
  const users = result.data || result;
  
  const filteredUsers = users.filter((user: Employee) =>
    user.role === 'help_desk' || user.role === 'admin'
  );

  return filteredUsers;
}

export default function StatusUpdate({ ticketId, currentStatus, currentResponsibleId }: StatusUpdateProps) {
  const queryClient = useQueryClient();
  const [statusUpdate, setStatusUpdate] = useState(currentStatus);
  const [transferToId, setTransferToId] = useState<number | ''>('');
  const [note, setNote] = useState('');

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
    staleTime: 5 * 60 * 1000, 
  });

  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter(employee => 
      employee.id !== currentResponsibleId
    );
  }, [employees, currentResponsibleId]);

  useEffect(() => {
    if (statusUpdate !== 'transfered') {
      setTransferToId('');
    }
  }, [statusUpdate]);

  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const payload: ItemData = {
        status: statusUpdate,
      };

      if (statusUpdate === 'transfered') {
        if (!transferToId) {
          throw new Error('Please select an employee to transfer to');
        }
        payload.transfer_to_id = transferToId;
      }

 

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      
        body: JSON.stringify(payload)
        
      });
      console.log(response)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      setNote('');
      toast.success('Status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleStatusUpdate = () => {
    updateStatusMutation.mutate();
  };

  const isFormValid = useMemo(() => {
    if (statusUpdate === 'transfered') {
      return !!transferToId;
    }
    return statusUpdate !== '';
  }, [statusUpdate, transferToId]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Update Status</h3>
      
      <div className="space-y-4">
        {/* اختيار الحالة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={statusUpdate}
            onChange={(e) => setStatusUpdate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="">Select status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="postponed">Postponed</option>
            <option value="transfered">Transfer</option>
          </select>
        </div>

        {/* اختيار الموظف عند النقل */}
        {statusUpdate === 'transfered' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transfer To
            </label>
            {isLoadingEmployees ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Loading employees...</span>
              </div>
            ) : (
              <select
                value={transferToId}
                onChange={(e) => setTransferToId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <option value="">Select employee</option>
                {filteredEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.role})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

     

        <Button 
          onClick={handleStatusUpdate}
          disabled={updateStatusMutation.isPending || !isFormValid}
          className="w-full"
        >
          {updateStatusMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-1" />
              Update Status
            </>
          )}
        </Button>
      </div>
    </div>
  );
}