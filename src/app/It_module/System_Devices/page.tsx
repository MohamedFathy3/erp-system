"use client";

import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";

import { useRouter } from "next/navigation";
import AddDeviceModal from "@/components/dashboard/AddDeviceModal";

interface Device {
  id: number;
  serialNumber: string;
  type: string;
  active: boolean;
  purchaseDateFormatted: string;
  memory?: { size: number; type: string };
  cpu?: { name: string };
  brand?: { name: string };
  deviceModel?: { name: string };
}

// API
async function getDevices(): Promise<Device[]> {
  const json = await apiFetch("/device");
  return json.data || [];
}
async function deleteDevice(id: number) {
  return apiFetch(`/device/${id}`, { 
    method: "DELETE",
    body: JSON.stringify({ itmes:[id] }) // هنا كتبها itmes بالغلط
  });
}
async function deleteDevices(ids: number[]) {
  return apiFetch(`/device/delete`, {
    method: "POST",
    body: JSON.stringify({ times:[ids] }), // هنا كتبت times
  });
}

async function toggleDeviceActive(id: number, active: boolean) {
  return apiFetch(`/device/${id}/active`, {
    method: "PUT",
    body: JSON.stringify({ active }),
  });
}



export default function SystemDevicesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["devices"] }),
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
    if (selected.length === 1) {
      deleteOneMutation.mutate(selected[0]);
    } else if (selected.length > 1) {
      deleteAllMutation.mutate(selected);
    }
    setSelected([]);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Devices
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your system devices
            </p>
          </div>
          <div className="flex gap-3">
            {selected.length > 0 && (
              <Button variant="destructive" onClick={handleDelete}>
                {selected.length === 1 ? "Delete" : "Delete All"}
              </Button>
            )}
            <Button onClick={() => setShowAddModal(true)}>+ Add Device</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center text-black justify-between bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <Input
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />
        </div>

        {/* Loading / Error */}
      
        {isError && <p className="text-red-500">Failed to fetch devices.</p>}

        {/* Table */}
        {!isLoading && !isError && (
          <div className="w-full overflow-x-auto rounded-lg shadow ring-1 ring-black/5">
            <table className="w-full table-auto divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
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
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(device.id)}
                        onChange={() => toggleSelect(device.id)}
                      />
                    </td>
                    <td className="px-4 py-2">{device.serialNumber}</td>
                    <td className="px-4 py-2">{device.type}</td>
                    <td className="px-4 py-2">{device.brand?.name || "-"}</td>
                    <td className="px-4 py-2">{device.deviceModel?.name || "-"}</td>
                    <td className="px-4 py-2">{device.cpu?.name || "-"}</td>
                    <td className="px-4 py-2">
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
      device.active ? "bg-green-500" : "bg-gray-400"
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
        device.active ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </div>
</td>

                    <td className="px-4 py-2">{device.purchaseDateFormatted}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/It_module/System_Devices/system/${device.id}`)
                        }
                      >
                        view
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteOneMutation.mutate(device.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Device Modal */}
        <AddDeviceModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onDeviceAdded={handleAddSuccess}
        />

        {/* Edit Device Modal */}
        {editDevice && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-[500px] shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Device</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Editing device: {editDevice.serialNumber}
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditDevice(null)}>
                  Cancel
                </Button>
                <Button>Save</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
