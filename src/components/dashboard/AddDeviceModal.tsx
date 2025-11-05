  // components/dashboard/AddDeviceModal.tsx
  'use client';

  import { useState, useEffect, useMemo } from 'react';
  import { useMutation, useQuery } from '@tanstack/react-query';
  import { X, Plus } from 'lucide-react';
  import { 
    addDevice, fetchBrands, fetchDeviceModels, fetchProcessors, 
    fetchGraphicCards, fetchMemories, fetchStorages, fetchDeviceStatuses, 
    fetchEmployees, addBrand, addDeviceModel, addProcessor, addGraphicCard, 
    addMemory, addStorage, fetchDeviceTypes
  } from '@/lib/api/deviceApi';
  import { Device, Storage } from '@/types/device';
  import toast from 'react-hot-toast';
  import AddItemModal from './AddItemModal';
import { useCallback } from 'react';

  interface AddDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeviceAdded: () => void;
  }

  const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onDeviceAdded }) => {
    const [formData, setFormData] = useState<Partial<Device>>({
      type: '',
      serialNumber: '',
      condition: 'used',
      note: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpireDate: '',
      memoryId: undefined,
      graphicCardId: undefined,
      processorId: undefined,
      brandId: undefined,
      device_status_id: 1,
      employee: undefined,
      deviceModelId: undefined,
      storages: [{ type: 'primary', storageId: 0 }],
      active: 1,
    });

    const [showAddModal, setShowAddModal] = useState<string | null>(null);
useEffect(() => {
  return () => {
    // Reset form when closing
    if (!isOpen) {
      setFormData({ /* initial state */ });
    }
  };
}, [isOpen]);

    // Fetch all data
    const { data: brands = [] } = useQuery({ 
      queryKey: ['brands'], 
      queryFn: fetchBrands,
      enabled: isOpen,
    });

    const { data: deviceTypes = [] } = useQuery({
      queryKey: ['deviceTypes'],
      queryFn: fetchDeviceTypes,
      enabled: isOpen,
    });
    
    const { data: allDeviceModels = [] } = useQuery({ 
      queryKey: ['deviceModels'], 
      queryFn: () => fetchDeviceModels(),
      enabled: isOpen,
    });
    
    const { data: processors = [] } = useQuery({ 
      queryKey: ['processors'], 
      queryFn: fetchProcessors,
      enabled: isOpen,
    });
    
    const { data: graphicCards = [] } = useQuery({ 
      queryKey: ['graphicCards'], 
      queryFn: fetchGraphicCards,
      enabled: isOpen,
    });
    
    const { data: memories = [] } = useQuery({ 
      queryKey: ['memories'], 
      queryFn: fetchMemories,
      enabled: isOpen,
    });
    
    const { data: storages = [] } = useQuery({ 
      queryKey: ['storages'], 
      queryFn: fetchStorages,
      enabled: isOpen,
    });
    
    const { data: deviceStatuses = [] } = useQuery({ 
      queryKey: ['deviceStatuses'], 
      queryFn: fetchDeviceStatuses,
      enabled: isOpen,
    });
    
    const { data: employees = [] } = useQuery({ 
      queryKey: ['employees'], 
      queryFn: fetchEmployees,
      enabled: isOpen,
    });

    // Filter device models based on selected brand
    const filteredDeviceModels = useMemo(() => {
      if (!formData.brandId) return allDeviceModels;
      
      return allDeviceModels.filter(model => {
        if (!model.brandId) return false;
        
        const modelBrandId = model.brandId.toString();
        const formBrandId = formData.brandId?.toString();
        
        return modelBrandId && formBrandId && modelBrandId === formBrandId;
      });
    }, [allDeviceModels, formData.brandId]);

    const showComputerFields = formData.type === 'Laptop' || formData.type === 'desktop';
    const showLaptopOnlyFields = formData.type === 'Laptop';

    // Add device mutation
    const addDeviceMutation = useMutation({
      mutationFn: addDevice,
      onSuccess: () => {
        toast.success('Device added successfully!');
        onDeviceAdded();
        // Reset form
        setFormData({
          type: '',
          serialNumber: '',
          condition: 'used',
          note: '',
          purchaseDate: new Date().toISOString().split('T')[0],
          warrantyExpireDate: '',
          memoryId: undefined,
          graphicCardId: undefined,
          processorId: undefined,
          brandId: undefined,
          device_status_id: 1,
          employee: undefined,
          deviceModelId: undefined,
          storages: [{ type: 'primary', storageId: 0 }],
          active: 1,
        });
      },
  onError: (error: Error) => {
  if (error.message.includes('network')) {
    toast.error('Network error - please check your connection');
  } else if (error.message.includes('serial number')) {
    toast.error('Serial number already exists');
  } else {
    toast.error('Failed to add device');
  }
  console.error('Add device error:', error);
},
    });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.serialNumber || !formData.type) {
    toast.error('Please fill in all required fields');
    return;
  }

  if (showLaptopOnlyFields && (!formData.memoryId || formData.storages?.some(s => s.storageId === 0))) {
    toast.error('Please select memory and storage for laptop');
    return;
  }
};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));

      // Reset dependent fields when brand changes
      if (name === 'brandId') {
        setFormData(prev => ({
          ...prev,
          deviceModelId: undefined
        }));
      }

      // Reset computer-specific fields when device type changes to non-computer
      if (name === 'type' && value !== 'laptop' && value !== 'desktop') {
        setFormData(prev => ({
          ...prev,
          processorId: undefined,
          graphicCardId: undefined,
          memoryId: undefined,
          storages: [{ type: 'primary', storageId: 0 }]
        }));
      }
    };

    const handleStorageChange = (index: number, field: keyof Storage, value: string | number) => {
  const newStorages = [...(formData.storages || [])];
      newStorages[index] = { ...newStorages[index], [field]: value };
      setFormData(prev => ({ ...prev, storages: newStorages }));
    };

    const addStorageField = () => {
      setFormData(prev => ({
        ...prev,
        storages: [...prev.storages!, { type: 'additional', storageId: 0 }]
      }));
    };

    const removeStorageField = (index: number) => {
      if (formData.storages!.length > 1) {
        const newStorages = formData.storages!.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, storages: newStorages }));
      }
    };

    if (!isOpen) return null;

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Device</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Type</option>
                    {deviceTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter serial number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status *
                  </label>
                  <select
                    name="device_status_id"
                    value={formData.device_status_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Status</option>
                    {deviceStatuses.map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Brand and Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Brand
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="brandId"
                      value={formData.brandId || ''}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddModal('brand')}
                      className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="deviceModelId"
                      value={formData.deviceModelId || ''}
                      onChange={handleChange}
                      disabled={!formData.brandId}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Model</option>
                      {filteredDeviceModels.map(model => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddModal('model')}
                      disabled={!formData.brandId}
                      className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Computer-specific fields (Laptop & Desktop) */}
              {showComputerFields && (
                <>
                  {/* Processor and Graphic Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Processor
                      </label>
                      <div className="flex gap-2">
                        <select
                          name="processorId"
                          value={formData.processorId || ''}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Processor</option>
                          {processors.map(processor => (
                            <option key={processor.id} value={processor.id}>{processor.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowAddModal('processor')}
                          className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Graphic Card
                      </label>
                      <div className="flex gap-2">
                        <select
                          name="graphicCardId"
                          value={formData.graphicCardId || ''}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Graphic Card</option>
                          {graphicCards.map(card => (
                            <option key={card.id} value={card.id}>{card.model}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowAddModal('graphicCard')}
                          className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Memory (Laptop only) */}
                  {showLaptopOnlyFields && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Memory
                      </label>
                      <div className="flex gap-2">
                        <select
                          name="memoryId"
                          value={formData.memoryId || ''}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Memory</option>
                          {memories.map(memory => (
                            <option key={memory.id} value={memory.id}>
                              {memory.size} {memory.type}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowAddModal('memory')}
                          className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Storages (Laptop only) */}
                  {showLaptopOnlyFields && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Storages
                      </label>
                      {formData.storages?.map((storage, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <select
                            value={storage.storageId || 0}
                            onChange={(e) => handleStorageChange(index, 'storageId', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value={0}>Select Storage</option>
                            {storages.map(storageItem => (
                              <option key={storageItem.id} value={storageItem.id}>
                                {storageItem.size} {storageItem.type}
                              </option>
                            ))}
                          </select>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeStorageField(index)}
                              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={addStorageField}
                          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                          Add Storage
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddModal('storage')}
                          className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Warranty Expire Date
                  </label>
                  <input
                    type="datetime-local"
                    name="warrantyExpireDate"
                    value={formData.warrantyExpireDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Active
                  </label>
                  <div
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, active: prev.active ? 0 : 1 }))
                    }
                    className={`relative w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      formData.active ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        formData.active ? "translate-x-7" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {formData.active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Additional notes about the device"
                />
              </div>

              {/* Error Message */}
              {addDeviceMutation.isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {addDeviceMutation.error.message}
                </div>
              )}

              {/* Action Buttons */}
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
                  disabled={addDeviceMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
                >
                  {addDeviceMutation.isPending ? 'Saving...' : 'Save Device'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Add Item Modals - مصحح */}
        {showAddModal === 'brand' && (
          <AddItemModal
            isOpen={true}
            onClose={() => setShowAddModal(null)}
            onAdd={(newBrand) => {
              if (newBrand && newBrand.id) {
                setFormData(prev => ({ ...prev, brandId: newBrand.id }));
              }
            }}
            title="Brand"
            fields={[{ name: 'name', label: 'Brand Name', type: 'text' }]}
            addFunction={(data) => addBrand(data.name)}
            queryKey={['brands']}
          />
        )}

        {showAddModal === 'model' && (
          <AddItemModal
            isOpen={true}
            onClose={() => setShowAddModal(null)}
            onAdd={(newModel) => {
              if (newModel && newModel.id) {
                setFormData(prev => ({ ...prev, deviceModelId: newModel.id }));
              }
            }}
            title="Device Model"
            fields={[
              { name: 'name', label: 'Model Name', type: 'text' },
              { 
                name: 'brandId', 
                label: 'Brand ID', 
                type: 'hidden',
                value: formData.brandId?.toString() || ''
              }
            ]}
            addFunction={(data) => addDeviceModel(data.name, parseInt(data.brandId))}
            queryKey={['deviceModels']}
          />
        )}

        {showAddModal === 'processor' && (
          <AddItemModal
            isOpen={true}
            onClose={() => setShowAddModal(null)}
            onAdd={(newProcessor) => {
              if (newProcessor && newProcessor.id) {
                setFormData(prev => ({ ...prev, processorId: newProcessor.id }));
              }
            }}
            title="Processor"
            fields={[{ name: 'name', label: 'Processor Name', type: 'text' }]}
            addFunction={(data) => addProcessor(data.name)}
            queryKey={['processors']}
          />
        )}

        {showAddModal === 'graphicCard' && (
          <AddItemModal
            isOpen={true}
            onClose={() => setShowAddModal(null)}
            onAdd={(newCard) => {
              if (newCard && newCard.id) {
                setFormData(prev => ({ ...prev, graphicCardId: newCard.id }));
              }
            }}
            title="Graphic Card"
            fields={[
              { name: 'model', label: 'Graphic Card Name', type: 'text' }, 
              { name: 'vram', label: 'VRAM', type: 'text' }
            ]}
            addFunction={(data) => addGraphicCard(data.model, data.vram)}
            queryKey={['graphicCards']}
          />
        )}

        {showAddModal === 'memory' && (
          <AddItemModal
            isOpen={true}
            onClose={() => setShowAddModal(null)}
            onAdd={(newMemory) => {
              if (newMemory && newMemory.id) {
                setFormData(prev => ({ ...prev, memoryId: newMemory.id }));
              }
            }}
            title="Memory"
            fields={[
              { name: 'size', label: 'Memory Size', type: 'text' },
              { name: 'type', label: 'Memory Type', type: 'text' }
            ]}
            addFunction={(data) => addMemory(data.size, data.type)}
            queryKey={['memories']}
          />
        )}

        {showAddModal === 'storage' && (
          <AddItemModal
            isOpen={true}
            onClose={() => setShowAddModal(null)}
            onAdd={(newStorage) => {
              // Add the new storage to the form
              const newStorages = [...formData.storages!];
              newStorages[newStorages.length - 1] = { 
                ...newStorages[newStorages.length - 1], 
                storageId: newStorage.id 
              };
              setFormData(prev => ({ ...prev, storages: newStorages }));
            }}
            title="Storage"
            fields={[
              { name: 'size', label: 'Storage size', type: 'text' },
              { name: 'type', label: 'Storage Type', type: 'text' }
            ]}
            addFunction={(data) => addStorage(Number(data.size), data.type)}
            queryKey={['storages']}
          />
        )}
      </>
    );
  };

  export default AddDeviceModal;