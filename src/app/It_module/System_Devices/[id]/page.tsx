"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/MainLayout";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HistoryRecord } from '@/types/history'
import AssignDeviceModal from '@/components/system/addaction';
import DeviceActionModal from '@/components/system/DeviceActionModal';

import { 
  Cpu, 
  MemoryStick, 
  Calendar, 
  Shield, 
  FileText,
  User, 
  Users,
  Clock,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  HardDrive,
  Activity,
  BarChart3,
  UserX,
 
  Server,
  Laptop,
  HardDriveIcon,

} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Device } from "@/types/deviceAction";

async function getDeviceById(id: string) {
  const json = await apiFetch(`/device/${id}`);
  return json.data;
}

async function downloadHistory(id: number) {
  try {
    const response = await apiFetch(`/device-history-pdf/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filters: {},
        orderBy: "id",
        orderByDirection: "desc",
        perPage: 200,
        paginate: 1
      }),
    });

    const blob = new Blob([response], { type: 'application/pdf' });
    
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `device-history-${id}.pdf`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(downloadLink);

  } catch (error) {
    console.error('Error downloading history PDF:', error);
  }
}

async function getDeviceHistory(id: string) {
  const json = await apiFetch(`/device/history/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      filters: {},
      orderBy: "id",
      orderByDirection: "desc",
      perPage: 10,
      paginate: 1
    })
  });
  return json.data;
}



export default function DeviceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const router = useRouter();

  const { data: device, isLoading, isError } = useQuery({
    queryKey: ["device", id],
    queryFn: () => getDeviceById(id),
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["device-history", id],
    queryFn: () => getDeviceHistory(id),
    enabled: activeTab === 'history',
  });

 

  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<{id: number, serialNumber: string}>();

  const handleAddAction = (deviceId: number, deviceSerialNumber: string) => {
    setSelectedDevice({ id: deviceId, serialNumber: deviceSerialNumber });
    setShowActionModal(true);
  };

  const handleAssignDevice = (deviceId: number) => {
    setSelectedDevice({ id: deviceId, serialNumber: '' });
    setShowAssignModal(true);
  };

  const handleActionComplete = () => {
    setShowActionModal(false);
    setShowAssignModal(false);
    setSelectedDevice(undefined);
  };

  const handleClick = () => {
    router.push(`It_module/System_Devices/view/${id}`);
  };

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

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab device={device} />;
      case 'history':
        return <HistoryTab historyData={historyData} isLoading={historyLoading}  device={device} />;
      default:
        return <OverviewTab device={device} />;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Laptop className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddAction(device.id, device.serialNumber)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Action
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAssignDevice(device.id)}
                className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <User className="h-4 w-4" />
                Assign
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          <TabButton 
            icon={<Activity className="h-4 w-4" />} 
            label="Overview" 
            isActive={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <TabButton 
            icon={<BarChart3 className="h-4 w-4" />} 
            label="Specifications" 
            isActive={activeTab === 'specs'} 
            onClick={() => setActiveTab('specs')} 
          />
          <TabButton 
            icon={<Clock className="h-4 w-4" />} 
            label="History" 
            isActive={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          {/* <TabButton 
            icon={<Cctv className="h-4 w-4" />} 
            label="Monitoring" 
            isActive={activeTab === 'monitoring'} 
            onClick={() => setActiveTab('monitoring')} 
          /> */}
        </div>

        {/* Main Content - Tab Specific */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tab Content */}
          <div className="lg:col-span-2">
            {renderTabContent()}
          </div>

          {/* Right Column - Actions and User Info */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
           

            {/* Device Status Card */}
            <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Assigned Employee
                </h2>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 dark:text-gray-300">name</span>
                 <span>
                    {device.employee?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 dark:text-gray-300">Position</span>
                  <span className="font-medium text-gray-900 dark:text-white">{device.employee?.position || "N/A"}</span>
                </div>

                  <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 dark:text-gray-300">Department</span>
                  <span className="font-medium text-gray-900 dark:text-white">{device.employee?.department || "N/A"}</span>
                </div>
                
                 <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 dark:text-gray-300">Company</span>
                  <span className="font-medium text-gray-900 dark:text-white">{device.employee?.company || "N/A"}</span>
                </div>

                   <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 dark:text-gray-300">createdAt</span>
                  <span className="font-medium text-gray-900 dark:text-white">{device.employee?.createdAt || "N/A"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">givenBy</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    device.employee?.givenBy  && new Date(device.employee?.givenBy ) < new Date() 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  }`}>
                    {device.employee?.givenBy || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

 <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Device Status
                </h2>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 dark:text-gray-300">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    device.active
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                    {device.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 dark:text-gray-300">Condition</span>
                  <span className="font-medium text-gray-900 dark:text-white">{device.condition || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Warranty</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    device.warrantyExpireDate && new Date(device.warrantyExpireDate) < new Date() 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  }`}>
                    {device.warrantyExpireDateFormatted || "N/A"}
                  </span>
                </div>
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

        {/* Modals */}
        {selectedDevice && (
          <DeviceActionModal
            isOpen={showActionModal}
            onClose={() => setShowActionModal(false)}
            onActionComplete={handleActionComplete}
            deviceId={selectedDevice.id}
            deviceSerialNumber={selectedDevice.serialNumber}
          />
        )}

        {selectedDevice && (
          <AssignDeviceModal
            isOpen={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            onAssignmentComplete={handleActionComplete}
            selectedDeviceId={selectedDevice.id}
          />
        )}
      </div>
    </MainLayout>
  );
}

// Tab Button Component
function TabButton({ icon, label, isActive, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      className={`px-4 py-3 font-medium text-sm md:text-base flex items-center gap-2 whitespace-nowrap ${
        isActive 
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

// Overview Tab Component
function OverviewTab({ device }: { device: Device }) {
  return (
    <div className="space-y-6">
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
  value={device.condition ?? "N/A"} 
            icon={<Activity className="h-4 w-4 text-blue-500" />}
          />
          <DetailItem 
            label="Status" 
  value={device.deviceStatus?.name ?? "N/A"} 
            icon={<CheckCircle className="h-4 w-4 text-green-500" />}
          />
          <DetailItem 
            label="Purchase Date" 
  value={device.purchaseDateFormatted ?? "N/A"} 
            icon={<Calendar className="h-4 w-4 text-purple-500" />}
          />
          <DetailItem 
            label="Warranty Expire" 
            value={device.warrantyExpireDateFormatted ?? "N?A"}
            status={device.warrantyExpireDate && new Date(device.warrantyExpireDate) < new Date() ? "expired" : "valid"}
            icon={<Shield className="h-4 w-4 text-amber-500" />}
          />
          {device.cpu && (
            <DetailItem 
              label="CPU" 
              value={device.cpu.name} 
              icon={<Cpu className="h-4 w-4 text-indigo-500" />}
            />
          )}
          {device.memory && (
            <DetailItem 
              label="Memory" 
              value={`${device.memory.size} GB ${device.memory.type}`} 
              icon={<MemoryStick className="h-4 w-4 text-pink-500" />}
            />
          )}
          {device.gpu && (
            <DetailItem 
              label="GPU" 
              value={`${device.gpu.model} (${device.gpu.vram})`} 
              icon={<HardDrive className="h-4 w-4 text-indigo-500" />}
            />
          )}
      {Array.isArray(device.hdDriver) && device.hdDriver.length > 0 ? (
  device.hdDriver.map((hd, index) => (
    <DetailItem
      key={hd.id || index}
      label={`Storage ${index + 1}`}
      value={`${hd?.size ?? 'N/A'} GB ${hd?.type ?? ''}`}
      icon={<HardDriveIcon className="h-4 w-4 text-teal-500" />}
    />
  ))
) : (
  <DetailItem
    label="Storage"
    value="No drives available"
    icon={<HardDriveIcon className="h-4 w-4 text-red-500" />}
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
  );
}

// Specifications Tab Component

// History Tab Component
function HistoryTab({
  historyData,
  isLoading,
  device,
}: {
  historyData: HistoryRecord[];  
  isLoading: boolean;
  device: Device;
}) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Device History
          </h2>
        </div>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
   <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
  {/* Header */}
  <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Clock className="h-6 w-6" />
        Device History
      </h2>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm bg-blue-500/20 px-3 py-1.5 rounded-full">
          <span className="bg-white/20 p-1 rounded-full">
            <FileText className="h-4 w-4" />
          </span>
          <span>{historyData?.length || 0} records found</span>
        </div>

      
      <Button 
  onClick={() => device && downloadHistory(device.id)} 
  variant="secondary" 
  size="sm" 
  className="bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
  disabled={!device} // تعطيل الزر إذا device غير متوفر
>
  <Download className="h-4 w-4" />
  Export PDF
</Button>
      </div>
    </div>
  </div>

  <CardContent className="p-0">
    {historyData && historyData.length > 0 ? (
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-left border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Action Type
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Note
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Involved Parties
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date & Time
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {historyData.map((item: HistoryRecord) => (
                <tr key={item.id} className="transition-all duration-200 hover:bg-blue-50/30 dark:hover:bg-gray-800/30">
                  {/* Action Type */}
                  <td className="px-6 py-4">
                    <div className={`p-2 rounded-lg inline-flex items-center text-xs font-medium ${
                      item.action_type === "Hardware Issues"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        : item.action_type === "Email & Communication"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : item.action_type === "Software Installation"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}>
                      {item.action_type}
                    </div>
                  </td>

                  {/* Note */}
                  <td className="px-6 py-4 max-w-xs">
                    <div className="group relative">
                      <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 font-medium">
                        {item.note}
                      </p>
                      {item.note && item.note.length > 60 && (
                        <div className="absolute invisible group-hover:visible z-10 bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-xl">
                          <div className="font-semibold mb-1">Full Note:</div>
                          {item.note}
                          <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Involved Parties */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-4">
                      {item.help_desk_name && (
                        <div className="flex items-start text-sm">
                          <div className="bg-blue-100 dark:bg-blue-900/20 p-1.5 rounded-full mr-2 mt-1">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Help Desk</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.help_desk_name}
                            </div>
                            {item.employee_name && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Assign device to <span className="font-semibold text-gray-700 dark:text-gray-300">{item.employee_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {item.employee_name && (
                        <div className="flex items-start text-sm">
                          <div className="bg-green-100 dark:bg-green-900/20 p-1.5 rounded-full mr-2 mt-1">
                            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Employee</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.employee_name}
                            </div>
                            {item.help_desk_name && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Received from <span className="font-semibold text-gray-700 dark:text-gray-300">{item.help_desk_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {!item.help_desk_name && !item.employee_name && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center">
                          <UserX className="h-4 w-4 mr-1" />
                          No parties involved
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {item.createdAt}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No history recorded</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          There are no history records for this device yet. Actions will appear here once they are logged.
        </p>
      </div>
    )}
  </CardContent>
</Card>

  );
}

// Detail Item Component
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