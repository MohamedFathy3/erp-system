// app/It_module/System_Devices/page.tsx
"use client";

import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AddDeviceModal from "@/components/dashboard/AddDeviceModal";
import EditDeviceModal from "@/components/dashboard/EditDeviceModal";

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

// API - مصحح
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

// مكون النظام الشمسي
const SolarSystemDesign = ({ devices, onDeviceClick, selectedDevices, onToggleSelect, onEditDevice }: { 
  devices: Device[];
  onDeviceClick: (device: Device) => void;
  selectedDevices: number[];
  onToggleSelect: (id: number) => void;
  onEditDevice: (device: Device) => void;
}) => {
  const [hoveredDevice, setHoveredDevice] = useState<Device | null>(null);

  // مدارات الكواكب (مسافات مختلفة)
  const orbits = [
    { radius: 180, speed: 40, color: 'from-blue-400 to-cyan-400' },
    { radius: 280, speed: 30, color: 'from-purple-400 to-pink-400' },
    { radius: 380, speed: 25, color: 'from-green-400 to-emerald-400' },
    { radius: 480, speed: 20, color: 'from-orange-400 to-red-400' },
    { radius: 580, speed: 15, color: 'from-indigo-400 to-violet-400' },
  ];

  // توزيع الأجهزة على المدارات
  const devicesPerOrbit = Math.ceil(devices.length / orbits.length);

  return (
    <div className="relative w-full h-[80vh] bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-2xl overflow-hidden">
      
      {/* النجوم في الخلفية */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* الشمس - المركز */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          {/* الشمس الرئيسية */}
          <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-2xl shadow-yellow-400/50 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 bg-yellow-200 rounded-full opacity-30 animate-ping"></div>
          </div>
          
          {/* تأثير الإشعاع */}
          <div className="absolute inset-0 w-32 h-32 bg-yellow-300 rounded-full animate-ping opacity-20"></div>
          <div className="absolute -inset-4 w-40 h-40 bg-yellow-200 rounded-full animate-pulse opacity-10"></div>
        </div>
        
        {/* نص الشمس */}
        <div className="text-center mt-6">
          <div className="text-white bg-black bg-opacity-50 rounded-lg px-4 py-2 text-lg font-bold backdrop-blur-sm">
            🚀 System Hub
          </div>
          <div className="text-yellow-200 text-sm mt-2 font-medium">
            {devices.length} Active Devices
          </div>
        </div>
      </div>

      {/* المدارات والكواكب */}
      {orbits.map((orbit, orbitIndex) => {
        const orbitDevices = devices.slice(
          orbitIndex * devicesPerOrbit,
          (orbitIndex + 1) * devicesPerOrbit
        );

        return (
          <div key={orbitIndex} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* خط المدار */}
           
            
            {/* الكواكب في هذا المدار */}
            {orbitDevices.map((device, deviceIndex) => {
              const totalDevicesInOrbit = orbitDevices.length;
              const angle = (deviceIndex / totalDevicesInOrbit) * 2 * Math.PI;
              const x = Math.cos(angle) * orbit.radius;
              const y = Math.sin(angle) * orbit.radius;

              // أحجام مختلفة للكواكب
              const planetSizes = ['w-16 h-16', 'w-14 h-14', 'w-20 h-20', 'w-12 h-12'];
              const planetSize = planetSizes[deviceIndex % planetSizes.length];

              return (
                <div
                  key={device.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
                    hoveredDevice?.id === device.id ? 'scale-150 z-30' : 'scale-100 z-20'
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    animation: `solarOrbit ${orbit.speed}s linear infinite`,
                  }}
                  onMouseEnter={() => setHoveredDevice(device)}
                  onMouseLeave={() => setHoveredDevice(null)}
                >
                  {/* الكوكب - الجهاز */}
                  <div className={`relative cursor-pointer transform transition-all duration-500 ${
                    hoveredDevice?.id === device.id ? 'scale-110 rotate-12' : 'hover:scale-105'
                  }`}>
                    
                    {/* الكوكب نفسه */}
                    <div 
                      className={`
                        ${planetSize} rounded-full border-4 flex items-center justify-center shadow-2xl
                        bg-gradient-to-br ${orbit.color}
                        ${device.active 
                          ? 'border-green-400 shadow-green-400/30' 
                          : 'border-red-400 shadow-red-400/30 grayscale'
                        }
                        ${selectedDevices.includes(device.id) 
                          ? 'ring-4 ring-blue-400 ring-opacity-70' 
                          : ''
                        }
                        transition-all duration-300
                      `}
                      onClick={() => onDeviceClick(device)}
                    >
                      {/* أيقونة الجهاز */}
                      <div className="text-lg drop-shadow-lg">
                        {device.type === 'laptop' ? '💻' : 
                         device.type === 'desktop' ? '🖥️' : 
                         device.type === 'tablet' ? '📱' : 
                         device.type === 'server' ? '🔧' : '⚡'}
                      </div>
                      
                      {/* حلقات الكوكب */}
                      <div className="absolute -inset-2 border-2 border-white border-opacity-20 rounded-full"></div>
                    </div>

                    {/* اسم الجهاز */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="text-white text-xs font-bold bg-black bg-opacity-50 px-2 py-1 rounded backdrop-blur-sm">
                        {device.serialNumber.slice(-6)}
                      </div>
                    </div>

                    {/* معلومات الجهاز عند Hover */}
                    {hoveredDevice?.id === device.id && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-80 bg-gray-900 bg-opacity-95 rounded-xl shadow-2xl p-6 z-40 border border-gray-700 backdrop-blur-lg">
                        <div className="text-center mb-4">
                          <div className="font-bold text-white text-xl mb-2">
                            {device.serialNumber}
                          </div>
                          <div className="text-gray-300 capitalize text-lg">
                            {device.type} Device
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Brand:</span>
                              <span className="font-medium text-white">{device.brand?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Model:</span>
                              <span className="font-medium text-white">{device.deviceModel?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">CPU:</span>
                              <span className="font-medium text-white">{device.cpu?.name || '-'}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">RAM:</span>
                              <span className="font-medium text-white">
                                {device.memory ? `${device.memory.size} ${device.memory.type}` : '-'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Status:</span>
                              <span className={`font-medium ${device.active ? 'text-green-400' : 'text-red-400'}`}>
                                {device.active ? '🟢 Active' : '🔴 Inactive'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Purchase:</span>
                              <span className="font-medium text-white">{device.purchaseDateFormatted}</span>
                            </div>
                          </div>
                        </div>

                        {/* الأزرار */}
                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSelect(device.id);
                            }}
                          >
                            {selectedDevices.includes(device.id) ? '🌟 Deselect' : '⭐ Select'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditDevice(device);
                            }}
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeviceClick(device);
                            }}
                          >
                            👁️ View
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* الـ CSS للحركة */}
      <style jsx>{`
        @keyframes solarOrbit {
          0% { 
            transform: translate(-50%, -50%) rotate(0deg) translateX(${orbits[0].radius}px) rotate(0deg); 
          }
          100% { 
            transform: translate(-50%, -50%) rotate(360deg) translateX(${orbits[0].radius}px) rotate(-360deg); 
          }
        }
        
        ${orbits.map((orbit, index) => `
          div:nth-child(${index + 2}) > div > div {
            animation: solarOrbit ${orbit.speed}s linear infinite;
            transform-origin: ${orbit.radius}px center;
          }
        `).join('')}
      `}</style>
    </div>
  );
};

export default function SystemDevicesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [viewMode, setViewMode] = useState<'solar' | 'table'>('solar');

  const {
    data: devices = [],
    isLoading,
    isError,
  } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: getDevices,
    staleTime: 60 * 1000,
  });

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

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      const matchesSearch =
        d.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        d.type.toLowerCase().includes(search.toLowerCase()) ||
        d.brand?.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.deviceModel?.name?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [devices, search]);

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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🌌 System Galaxy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore your devices in our digital universe
            </p>
          </div>
          <div className="flex gap-3">
            {/* زر تبديل وضع المشاهدة */}
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'solar' ? 'table' : 'solar')}
              className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
            >
              {viewMode === 'solar' ? '📊 Switch to Table' : '🌠 Switch to Galaxy'}
            </Button>
            
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-800 p-4 rounded-lg shadow">
          <Input
            placeholder="🔍 Search devices in the galaxy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <div className="text-sm text-gray-300">
            🌟 {filteredDevices.length} devices discovered
          </div>
        </div>

        {/* Loading / Error */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
            <span className="ml-4 text-white text-lg">Launching Galaxy...</span>
          </div>
        )}
        {isError && (
          <div className="text-red-400 text-center bg-red-900 bg-opacity-50 p-4 rounded-lg">
            ❌ Failed to connect to the galaxy
          </div>
        )}

        {/* المحتوى حسب وضع المشاهدة */}
        {!isLoading && !isError && (
          <>
            {viewMode === 'solar' ? (
              // النظام الشمسي
              <SolarSystemDesign 
                devices={filteredDevices}
                onDeviceClick={handleDeviceClick}
                selectedDevices={selected}
                onToggleSelect={toggleSelect}
                onEditDevice={handleEditDevice}
              />
            ) : (
              // الجدول التقليدي
              <div className="w-full overflow-x-auto rounded-lg shadow ring-1 ring-black/5 bg-gray-800">
                <table className="w-full table-auto divide-y divide-gray-700 text-sm">
                  <thead className="bg-gray-700 text-gray-300 font-semibold">
                    <tr>
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={
                            selected.length > 0 &&
                            selected.length === filteredDevices.length
                          }
                          onChange={(e) =>
                            setSelected(
                              e.target.checked
                                ? filteredDevices.map((d) => d.id)
                                : []
                            )
                          }
                          className="bg-gray-600"
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
                        "Actions",
                      ].map((col) => (
                        <th key={col} className="px-4 py-3 text-left whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredDevices.map((device) => (
                      <tr
                        key={device.id}
                        className="hover:bg-gray-750 transition-colors"
                      >
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selected.includes(device.id)}
                            onChange={() => toggleSelect(device.id)}
                            className="bg-gray-600"
                          />
                        </td>
                        <td className="px-4 py-2 text-white">{device.serialNumber}</td>
                        <td className="px-4 py-2 text-gray-300">{device.type}</td>
                        <td className="px-4 py-2 text-gray-300">{device.brand?.name || "-"}</td>
                        <td className="px-4 py-2 text-gray-300">{device.deviceModel?.name || "-"}</td>
                        <td className="px-4 py-2 text-gray-300">{device.cpu?.name || "-"}</td>
                        <td className="px-4 py-2 text-gray-300">
                          {device.memory
                            ? `${device.memory.size} ${device.memory.type}`
                            : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <div
                            onClick={() =>
                              toggleActiveMutation.mutate({
                                id: device.id,
                                active: !device.active,
                              })
                            }
                            className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                              device.active ? "bg-green-500" : "bg-gray-600"
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                device.active ? "translate-x-6" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{device.purchaseDateFormatted}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditDevice(device)}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeviceClick(device)}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this device?")) {
                                deleteOneMutation.mutate(device.id);
                              }
                            }}
                            disabled={deleteOneMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deleteOneMutation.isPending ? 'Deleting...' : 'Delete'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Add Device Modal */}
        <AddDeviceModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onDeviceAdded={handleAddSuccess}
        />

        {/* Edit Device Modal */}
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