"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/MainLayout";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import ActionModal from '@/components/dashboard/ActionModal';
import Image from "next/image";

import { 
  Cpu, 
  MemoryStick, 
  Calendar, 
  Shield, 
  User, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  HardDrive,
  Activity,
  BarChart3,
  SmartphoneCharging,
  Server
} from "lucide-react";
import { useState } from "react";

async function getDeviceById(id: string) {
  const json = await apiFetch(`/device/${id}`);
  return json.data;
}

export default function DeviceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: device, isLoading, isError } = useQuery({
    queryKey: ["device", id],
    queryFn: () => getDeviceById(id),
  });

  if (isLoading) return (
    <MainLayout>
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40 mx-auto"></div>
        </div>
      </div>
    </MainLayout>
  );
  
  if (isError || !device) return (
    <MainLayout>
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-center text-red-500">
          <XCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="mb-4">Failed to fetch device details.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <SmartphoneCharging className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {device.brand?.name} {device.deviceModel?.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Serial: {device.serialNumber}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {device.cpu && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                      <Cpu className="h-4 w-4" />
                      {device.cpu.name}
                    </span>
                  )}
                  {device.memory && (
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                      <MemoryStick className="h-4 w-4" />
                      {device.memory.size} GB {device.memory.type}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                      device.active
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {device.active ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {device.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

          <Button
  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg shadow-md text-white"
  onClick={() => {
    const event = new CustomEvent("open-action-modal", { detail: device });
    window.dispatchEvent(event);
  }}
>
  <Plus className="h-5 w-5" />
  Add Action
</Button>
          </div>
        </div>
<ActionModal />

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`px-4 py-3 font-medium text-sm md:text-base flex items-center gap-2 ${activeTab === 'overview' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity className="h-4 w-4" />
            Overview
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm md:text-base flex items-center gap-2 ${activeTab === 'specs' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('specs')}
          >
            <BarChart3 className="h-4 w-4" />
            Specifications
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm md:text-base flex items-center gap-2 ${activeTab === 'history' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock className="h-4 w-4" />
            History
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Device Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specifications Card */}
            <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Device Specifications
                </h2>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem 
                  label="Condition" 
                  value={device.condition} 
                  icon={<Activity className="h-4 w-4 text-blue-500" />}
                />
                <DetailItem 
                  label="Status" 
                  value={device.deviceStatus?.name} 
                  icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                />
                <DetailItem 
                  label="Purchase Date" 
                  value={device.purchaseDateFormatted} 
                  icon={<Calendar className="h-4 w-4 text-purple-500" />}
                />
                <DetailItem 
                  label="Warranty Expire" 
                  value={device.warrantyExpireDateFormatted}
                  status={new Date(device.warrantyExpireDate) < new Date() ? "expired" : "valid"}
                  icon={<Shield className="h-4 w-4 text-amber-500" />}
                />
                {device.gpu && (
                  <DetailItem 
                    label="GPU" 
                    value={`${device.gpu.model} (${device.gpu.vram})`} 
                    icon={<HardDrive className="h-4 w-4 text-indigo-500" />}
                  />
                )}
              </CardContent>
            </Card>

            {/* Performance Metrics Card */}
            <Card className="rounded-2xl shadow-lg border-0">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-4 text-white">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </h2>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Cpu className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white">CPU Usage</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">24%</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 dark:bg-purple-900/30 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MemoryStick className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Memory Usage</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">62%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions and User Info */}
          <div className="space-y-6">
            {/* Latest Actions Card */}
            <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4 text-white">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Actions
                </h2>
              </div>
              <CardContent className="p-6">
                {device.history && device.history.length > 0 ? (
                  <div className="space-y-4">
                    {device.history.slice(0, 3).map((action: { title: string; createdAt: string; createdBy?: { name: string } }, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {action.createdAt}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          By {action.createdBy?.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No actions recorded yet.</p>
                  </div>
                )}
                <Button variant="outline" className="w-full mt-6 rounded-lg flex items-center gap-2">
                  View All Actions
                  <Clock className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Registered By Card */}
            <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 text-white">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Registered By
                </h2>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {device.createdBy?.avatar ? (
                    <Image
                      src={device.createdBy.avatar}
                      width={56}
                      height={56}
                      alt={device.createdBy.name}
                      className="w-14 h-14 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm">
                      <User className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-lg text-gray-900 dark:text-white">{device.createdBy?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{device.createdBy?.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md inline-block">
                      {device.createdBy?.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Component for consistent detail items

function DetailItem({ label, value, icon, status }: { label: string; value: string; icon?: React.ReactNode; status?: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm">
        {icon}
      </div>
      <div>
        <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">{label}</span>
        {status ? (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              status === "expired"
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {status === "expired" ? (
              <AlertTriangle className="h-4 w-4 mr-1" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-1" />
            )}
            {value}
          </span>
        ) : (
          <span className="text-gray-900 dark:text-white">{value || "N/A"}</span>
        )}
      </div>
    </div>
  );
}