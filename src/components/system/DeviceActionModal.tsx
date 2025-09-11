// components/DeviceActionModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { fetchActionTypes, addDeviceAction } from '@/lib/api/deviceActionApi';
import { DeviceAction, ActionType } from '@/types/deviceAction';
import toast from 'react-hot-toast';

interface DeviceActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionComplete: () => void;
  deviceId: number;
  deviceSerialNumber: string;
}

const DeviceActionModal: React.FC<DeviceActionModalProps> = ({
  isOpen,
  onClose,
  onActionComplete,
  deviceId,
  deviceSerialNumber
}) => {
  const [formData, setFormData] = useState<Partial<DeviceAction>>({
    device_id: deviceId,
    action_type: '',
    note: ''
  });

  const [selectedActionType, setSelectedActionType] = useState<ActionType | null>(null);

  // Fetch action types
  const { data: actionTypes = [], isLoading: loadingActionTypes } = useQuery({
    queryKey: ['actionTypes'],
    queryFn: fetchActionTypes,
  });

  // Add device action mutation
  const addActionMutation = useMutation({
    mutationFn: addDeviceAction,
    onSuccess: () => {
      toast.success('Action added successfully!');
      onActionComplete();
      setFormData({
        device_id: deviceId,
        action_type: '',
        note: ''
      });
      setSelectedActionType(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to add action: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.action_type) {
      toast.error('Please select an action type');
      return;
    }

    addActionMutation.mutate(formData as DeviceAction);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'action_type') {
      const actionType = actionTypes.find(at => at.id.toString() === value);
      setSelectedActionType(actionType || null);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      device_id: deviceId
    }));
  }, [deviceId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Action for Device: {deviceSerialNumber}
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
          {/* Action Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Action Type *
            </label>
            <select
              name="action_type"
              value={formData.action_type || ''}
              onChange={handleChange}
              required
              disabled={loadingActionTypes}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Action Type</option>
              {actionTypes.map(actionType => (
                <option key={actionType.id} value={actionType.id}>
                  {actionType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes *
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Describe the action..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Error Message */}
          {addActionMutation.isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              Error: {addActionMutation.error.message}
            </div>
          )}

          {/* Action Buttons */}
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
              {addActionMutation.isPending ? 'Adding...' : 'Add Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceActionModal;