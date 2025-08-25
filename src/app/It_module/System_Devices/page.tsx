"use client";

import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; 

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

// API Functions
async function getDevices(): Promise<Device[]> {
  const json = await apiFetch("/device");
  return json.data || [];
}

async function deleteDevice(id: number) {
  return apiFetch(`/device/${id}`, { method: "DELETE" });
}

async function deleteDevices(ids: number[]) {
  return apiFetch(`/device/delete`, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export default function SystemDevicesPage() {
   const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);

  const queryClient = useQueryClient();

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

  const deleteAllMutation = useMutation({
    mutationFn: (ids: number[]) => deleteDevices(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["devices"] }),
  });

  // Filter
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

  // Toggle Select
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
        {isLoading && <p>Loading devices...</p>}
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
                    <th
                      key={col}
                      className="px-4 py-3 text-left whitespace-nowrap"
                    >
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
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          device.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {device.active ? "Active" : "Inactive"}
                      </span>
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
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-[500px] shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add Device</h2>
              {/* Form Fields for Add */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button>Add</Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Device Modal */}
        {editDevice && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-[500px] shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Device</h2>
              {/* Form Fields for Edit */}
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
