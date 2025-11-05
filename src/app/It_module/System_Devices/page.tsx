// app/It_module/System_Devices/page.tsx
"use client";

import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddDeviceModal from "@/components/dashboard/AddDeviceModal";
import EditDeviceModal from "@/components/dashboard/EditDeviceModal";
import Pagination from "@/components/Tablecomponents/Pagination";
import FilterSearch from "@/components/Tablecomponents/FilterSearch/FilterSearch";
import { FilterField } from '@/types/generic-data-manager';

interface Device {
  id: number;
  serialNumber: string;
  type: string;
  active: boolean;
  purchaseDateFormatted: string;
  memory?: { id: number; size: number; type: string };
  cpu?: { id: number; name: string };
  brand?: { id: number; name: string };
  deviceModel?: { id: number; name: string };
  device_status?: { id: number; name: string };
  graphicCard?: { id: number; model: string };
}

// API functions
async function getDevices(): Promise<Device[]> {
  const json = await apiFetch("/device");
  return json.data || [];
}

async function deleteDevice(id: number) {
  return apiFetch(`/device/delete`, { 
    method: "DELETE",
    body: JSON.stringify({ items: [id] })
  });
}

async function deleteDevices(ids: number[]) {
  return apiFetch(`/device/delete`, {
    method: "DELETE",
    body: JSON.stringify({ items: ids }),
  });
}

async function toggleDeviceActive(id: number, active: boolean) {
  return apiFetch(`/device/${id}/active`, {
    method: "PUT",
    body: JSON.stringify({ active }),
  });
}

// تعريف الفلاتر المتاحة
const availableFilters: FilterField[] = [
  {
    key: 'type',
    label: 'Device Type',
    type: 'select',
    options: [
      { value: 'laptop', label: 'Laptop' },
      { value: 'desktop', label: 'Desktop' },
      { value: 'tablet', label: 'Tablet' },
      { value: 'server', label: 'Server' }
    ]
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'select',
    options: [
      { value: 'hp', label: 'HP' },
      { value: 'dell', label: 'Dell' },
      { value: 'lenovo', label: 'Lenovo' },
      { value: 'apple', label: 'Apple' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    key: 'serialNumber',
    label: 'Serial Number',
    type: 'text',
    placeholder: 'Search by serial...'
  }
];

export default function SystemDevicesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // States
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [viewMode, setViewMode] = useState<'solar' | 'table'>('table');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  // Filter states
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [orderBy, setOrderBy] = useState('id');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilter, setShowFilter] = useState(false);

  // Fetch data with caching
  const {
    data: devices = [],
    isLoading,
    isError,
  } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: getDevices,
    staleTime: 5 * 60 * 1000, // 5 دقائق كاش
  });

  // Mutations
  const deleteOneMutation = useMutation({
    mutationFn: (id: number) => deleteDevice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["devices"] }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      toggleDeviceActive(id, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["devices"] }),
  });

  const deleteAllMutation = useMutation({
    mutationFn: (ids: number[]) => deleteDevices(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      setSelected([]);
    },
  });

  // Filter and sort data
  const filteredDevices = useMemo(() => {
    const filtered = devices.filter((device) => {
      // Search filter
      const matchesSearch = search === "" || 
        device.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        device.type.toLowerCase().includes(search.toLowerCase()) ||
        device.brand?.name?.toLowerCase().includes(search.toLowerCase()) ||
        device.deviceModel?.name?.toLowerCase().includes(search.toLowerCase());

      // Additional filters
      const matchesType = !filters.type || device.type.toLowerCase() === filters.type.toLowerCase();
      const matchesBrand = !filters.brand || device.brand?.name?.toLowerCase() === filters.brand.toLowerCase();
      const matchesStatus = !filters.status || 
        (filters.status === 'active' && device.active) ||
        (filters.status === 'inactive' && !device.active);
      const matchesSerial = !filters.serialNumber || 
        device.serialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase());

      return matchesSearch && matchesType && matchesBrand && matchesStatus && matchesSerial;
    });

    // Sorting
    filtered.sort((a, b) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aValue: any = a;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bValue: any = b;
      
      // Handle nested properties
    
      if (orderByDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [devices, search, filters, orderBy, orderByDirection]);

  // Pagination
  const paginatedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    return filteredDevices.slice(startIndex, startIndex + perPage);
  }, [filteredDevices, currentPage, perPage]);

  const totalPages = Math.ceil(filteredDevices.length / perPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, orderBy, orderByDirection]);

  // Handlers
  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (selected.length === 0) return;
    
    const confirmMessage = selected.length === 1 
      ? "Are you sure you want to delete this device?"
      : `Are you sure you want to delete ${selected.length} devices?`;

    if (confirm(confirmMessage)) {
      if (selected.length === 1) {
        deleteOneMutation.mutate(selected[0]);
      } else {
        deleteAllMutation.mutate(selected);
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  };

  const handleEditSuccess = () => {
    setEditDevice(null);
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  };

  const handleDeviceClick = (device: Device) => {
    router.push(`/It_module/System_Devices/${device.id}`);
  };

  const handleEditDevice = (device: Device) => {
    setEditDevice(device);
  };

  const handleApplyFilter = () => {
    // Filters are applied automatically through state
    console.log("Filters applied:", filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    setOrderBy('id');
    setOrderByDirection('desc');
    setSearch("");
  };

  const handleSearch = () => {
    // Search is applied automatically through state
    console.log("Search performed:", search);
  };

  // SolarSystemDesign component هنا (نفس الكود السابق)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
               System Management
            </h1>
           
          </div>
          <div className="flex gap-3">
           
            
            {selected.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                🗑️ {selected.length === 1 ? "Delete" : `Delete (${selected.length})`}
              </Button>
            )}
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              🚀 Add Device
            </Button>
          </div>
        </div>

        {/* FilterSearch Component */}
        <FilterSearch
          search={search}
          onSearchChange={setSearch}
          onSearch={handleSearch}
          filters={filters}
          onFiltersChange={setFilters}
          orderBy={orderBy}
          onOrderByChange={setOrderBy}
          orderByDirection={orderByDirection}
          onOrderByDirectionChange={setOrderByDirection}
          onApplyFilter={handleApplyFilter}
          onResetFilters={handleResetFilters}
          showFilter={showFilter}
          onToggleFilter={() => setShowFilter(!showFilter)}
          showSearch={true}
          showFilterSection={true}
          availableFilters={availableFilters}
        />

       

        {/* Error State */}
        {isError && (
          <div className="text-red-500 dark:text-red-400 text-center bg-red-50 dark:bg-red-900 dark:bg-opacity-20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            ❌ Failed to connect to the galaxy
          </div>
        )}

        {/* Content */}
        { !isError && (
          <>
        
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                
                {/* Table Header */}
                <div className="bg-gradient-to-r from-green-200 to-green-300 dark:from-green-900/30 dark:to-green-800/30 text-black dark:text-green-200 border-b border-green-100 dark:border-green-900/50 font-semibold text-lg px-6 py-4">
                  Devices Management
                </div>

                {/* Table Info Bar */}
                <div className="p-4 flex items-center justify-between bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {paginatedDevices.length} of {filteredDevices.length} devices
                    </span>
                  </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-center w-12">
                          <input
                            type="checkbox"
                            checked={selected.length > 0 && selected.length === paginatedDevices.length}
                            onChange={(e) => setSelected(e.target.checked ? paginatedDevices.map(d => d.id) : [])}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </th>
                        {[
                          "Serial Number",
                          "Type", 
                          "Brand",
                          "Model",
                          "Processor",
                          "RAM",
                          "Status",
                          "Purchase Date",
                          "Actions"
                        ].map((col) => (
                          <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedDevices.map((device) => (
                        <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={selected.includes(device.id)}
                              onChange={() => toggleSelect(device.id)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{device.serialNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 capitalize">{device.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{device.brand?.name || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{device.deviceModel?.name || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{device.cpu?.name || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {device.memory ? `${device.memory.size} ${device.memory.type}` : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                onClick={() => toggleActiveMutation.mutate({
                                  id: device.id,
                                  active: !device.active,
                                })}
                                className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                                  device.active ? "bg-green-500" : "bg-gray-400"
                                }`}
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                    device.active ? "translate-x-6" : "translate-x-0"
                                  }`}
                                />
                              </div>
                              <span className={`text-xs font-medium ${device.active ? 'text-green-600' : 'text-red-600'}`}>
                                {device.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{device.purchaseDateFormatted}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditDevice(device)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs"
                              >
                                ✏️ Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeviceClick(device)}
                                className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 text-xs"
                              >
                                👁️ View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

               
              </div>
            {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  lastPage={totalPages}
                  total={filteredDevices.length}
                  perPage={perPage}
                  onPageChange={setCurrentPage}
                  className="mt-0"
                />
          </>
        )}

        {/* Modals */}
        <AddDeviceModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onDeviceAdded={handleAddSuccess}
        />

        {editDevice && (
          <EditDeviceModal
            isOpen={true}
            onClose={() => setEditDevice(null)}
            onDeviceUpdated={handleEditSuccess}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
            device={editDevice as any}
          />
        )}
      </div>
    </MainLayout>
  );
}