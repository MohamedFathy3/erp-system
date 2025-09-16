'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { fetchEmployees, fetchDevices, addDeviceAction } from '@/lib/api/deviceActionApi';
import { DeviceAction } from '@/types/deviceAction';
import toast from 'react-hot-toast';

interface AssignDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentComplete: () => void;
  selectedDeviceId?: number;
}

const AssignDeviceModal: React.FC<AssignDeviceModalProps> = ({
  isOpen,
  onClose,
  onAssignmentComplete,
  selectedDeviceId
}) => {
  const [formData, setFormData] = useState<Partial<DeviceAction>>({
    device_id: selectedDeviceId || undefined,
    employee_id: undefined,
    action_type: 'assign',
    note: ''
  });

  // Fetch employees and devices
  const { data: employees = [], isLoading: loadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const { data: devices = [], isLoading: loadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    enabled: !selectedDeviceId, // Only fetch devices if no device is pre-selected
  });
const queryClient = useQueryClient();

const addActionMutation = useMutation({
  mutationFn: addDeviceAction,
  onSuccess: () => {
    toast.success('Device assigned successfully!');

    queryClient.invalidateQueries({ queryKey: ['device', formData.device_id] });
    queryClient.invalidateQueries({ queryKey: ['device-history', formData.device_id] });
    queryClient.invalidateQueries({ queryKey: ['device-specs', formData.device_id] });

    onAssignmentComplete();
    setFormData({
      device_id: selectedDeviceId || undefined,
      employee_id: undefined,
      action_type: 'assign',
      note: ''
    });
  },
  onError: (error: Error) => {
    toast.error(`Failed to assign device: ${error.message}`);
  },
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.device_id || !formData.employee_id) {
      toast.error('Please select both device and employee');
      return;
    }

    addActionMutation.mutate(formData as DeviceAction);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'device_id' || name === 'employee_id' ? parseInt(value) : value
    }));
  };

  useEffect(() => {
    if (selectedDeviceId) {
      setFormData(prev => ({
        ...prev,
        device_id: selectedDeviceId
      }));
    }
  }, [selectedDeviceId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {selectedDeviceId ? 'Assign Device' : 'Assign Device to Employee'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={addActionMutation.isPending}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Device Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {/* Device * */}
            </label>
            <select
              name="device_id"
              value={formData.device_id || ''}
              onChange={handleChange}
              required
              disabled={!!selectedDeviceId || loadingDevices}
              style={{display:'none'}}
              className="w-full  px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
              <option value="">Select Device</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.serialNumber} - {device.brand && `(${device.brand})`}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employee *
            </label>
            <select
              name="employee_id"
              value={formData.employee_id || ''}
              onChange={handleChange}
              required
              disabled={loadingEmployees}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} 
                </option>
              ))}
            </select>
          </div>

          <div style={{display:'none'}}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Action Type *
            </label>
            <select
              name="action_type"
              value={formData.action_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="assign">Assign</option>
            
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              placeholder="Add notes about this assignment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {addActionMutation.isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              Error: {addActionMutation.error.message}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={addActionMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addActionMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50"
            >
              {addActionMutation.isPending ? 'Assigning...' : 'Assign Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignDeviceModal;