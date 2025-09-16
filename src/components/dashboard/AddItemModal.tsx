// components/AddItemModal.tsx
'use client';

import { useState, useEffect } from 'react'; // أضف useEffect
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Field {
  name: string;
  label: string;
  type: string;
  value?: string; // أضف خاصية value اختيارية
}

interface AddItemModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: T) => void; // Specify a more precise type instead of 'any'
  title: string;
  fields: Field[]; // Use the modified Field type
  addFunction: (data: Record<string, string>) => Promise<T>; // Specify the return type of addFunction
  queryKey: string[];
}
type AnyObject = { [key: string]: string | number | boolean | undefined };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AddItemModal = <T extends { [key: string]: any }>({
  isOpen,
  onClose,
  onAdd,
  title,
  fields,
  addFunction,
  queryKey,
}: AddItemModalProps<T>) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      const initialData: Record<string, string> = {};
      fields.forEach(field => {
        if (field.value !== undefined) {
          initialData[field.name] = field.value;
        }
      });
      setFormData(initialData);
    }
  }, [isOpen, fields]);

  const addMutation = useMutation({
    mutationFn: addFunction,
    onSuccess: (data) => {
      toast.success(`${title} added successfully!`);
      onAdd(data);

      queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });

      setFormData({});
    },
    onError: (error: Error) => {
      toast.error(`Failed to add ${title}: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New {title}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={addMutation.isPending}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              {field.type !== "hidden" && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
              )}
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || field.value || ""}
                onChange={handleChange}
                required={field.type !== "hidden"}
                disabled={addMutation.isPending || field.type === "hidden"}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={field.type !== "hidden" ? `Enter ${field.label.toLowerCase()}` : undefined}
              />
            </div>
          ))}

          {addMutation.isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              Error: {addMutation.error.message}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={addMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addMutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;