// components/AddTicketModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { addTicketAdmin, fetchCategories, fetchDevices, fetchEmployees } from '@/lib/api/ticketApi';
import { Ticket, DeviceFilter } from '@/types/ticket';
import toast from 'react-hot-toast';
import { Employee } from '@/types/deviceAction';
import { Category } from '../CategoryTable';
import {apiFetch} from '@/lib/api';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketAdded: () => void;
}

const AddTicketModal: React.FC<AddTicketModalProps> = ({ isOpen, onClose, onTicketAdded }) => {
  const [formData, setFormData] = useState<Partial<Ticket>>({
    title: '',
    content: '',
    status: 'open',
    priority: 'medium',
    openAt: new Date().toISOString().split('T')[0],
    dailyStatus: false,
  });

  const [filters, setFilters] = useState<DeviceFilter>({});
  const [selectedEmployee, setSelectedEmployee] = useState<number | ''>('');
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('');

  const { data: categories = [], } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: employees = [], } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const { data: devices = [], isLoading: loadingDevices, refetch: refetchDevices } = useQuery({
    queryKey: ['devices', filters],
    queryFn: () => fetchDevices(filters),
    enabled: false, 
  });

  useEffect(() => {
    const newFilters: DeviceFilter = {};
    
    if (selectedEmployee) {
      newFilters.employee_id = selectedEmployee;
    }
    
    if (selectedDeviceType) {
      newFilters.type = selectedDeviceType;
    }
    
    setFilters(newFilters);
    
    if (selectedEmployee || selectedDeviceType) {
      refetchDevices();
    }
  }, [selectedEmployee, selectedDeviceType, refetchDevices]);

  const addTicketMutation = useMutation({
    mutationFn: addTicketAdmin,
    onSuccess: () => {
      toast.success('Ticket added successfully!');
      onClose();
      onTicketAdded();
      setFormData({
        title: '',
        content: '',
        status: 'pending',
        priority: 'medium',
        openAt: new Date().toISOString().split('T')[0],
        dailyStatus: false,
      });
      setSelectedEmployee('');
      setSelectedDeviceType('');
      setFilters({});
    },
    onError: (error: Error) => {
      toast.error(`Failed to add ticket: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTicketMutation.mutate(formData as Ticket);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* الحقول الأساسية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* فلترة الأجهزة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Employees</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Device Type
              </label>
              <select
                value={selectedDeviceType}
                onChange={(e) => setSelectedDeviceType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="LAPTOP">Laptop</option>
                <option value="DESKTOP">Desktop</option>
                <option value="TABLET">Tablet</option>
                <option value="PHONE">Phone</option>
                <option value="PRINTER">Printer</option>
                <option value="SCANNER">Scanner</option>
              </select>
            </div>
          </div>

          {/* عرض الأجهزة بعد الفلترة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Device
            </label>
            <select
              name="device"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                company: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              disabled={loadingDevices}
            >
              <option value="">Select Device</option>
              {loadingDevices ? (
                <option value="">Loading devices...</option>
              ) : (
                devices.map(device => (
                  <option key={device.id} value={device.name}>
                    {device.name} {device.employee_name && `- (${device.employee_name})`} {device.type && `- [${device.type}]`}
                  </option>
                ))
              )}
            </select>
            {(selectedEmployee || selectedDeviceType) && devices.length === 0 && !loadingDevices && (
              <p className="text-sm text-gray-500 mt-1">No devices found matching your filters</p>
            )}
          </div>

          {/* باقي الحقول */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status || 'open'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
                <option value="transfered">Transfered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority || 'medium'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={(formData.category as Category)?.name || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  category: { name: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assign to Employee
              </label>
              <select
                name="employee"
                value={(formData.employee as Employee)?.name || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  employee: { name: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Open Date
            </label>
            <input
              type="date"
              name="openAt"
              value={formData.openAt || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="dailyStatus"
              name="dailyStatus"
              checked={formData.dailyStatus || false}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="dailyStatus" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Daily Status
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addTicketMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {addTicketMutation.isPending ? 'Adding...' : 'Add Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicketModal;