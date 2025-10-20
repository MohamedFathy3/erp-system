// app/Analytics/page.tsx
"use client";

import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useState, useMemo, useRef, useEffect } from "react";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Smartphone, 
  Laptop, 
  Server,
  Tablet,
  Eye,
  Edit,
  Search,
  Filter,
  Download,
  Calendar,
  Cpu,
  HardDrive,
  Sun,
  Orbit,
  Zap,
  Network,
  Cloud,
  Shield,
  Monitor
} from "lucide-react";

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
  employee?: {
    id: number;
    name: string;
    email: string;
    department?: string;
  };
}

interface AnalyticsData {
  totalDevices: number;
  activeDevices: number;
  deviceTypes: { type: string; count: number }[];
  recentDevices: Device[];
  topBrands: { brand: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
}

// API Functions
async function getAnalyticsData(): Promise<AnalyticsData> {
  const devicesResponse = await apiFetch("/device");
  const devices: Device[] = devicesResponse.data || [];
  
  return {
    totalDevices: devices.length,
    activeDevices: devices.filter(d => d.active).length,
    deviceTypes: calculateDeviceTypes(devices),
    recentDevices: devices.slice(0, 8), // زيادة العدد ليكونوا كواكب
    topBrands: calculateTopBrands(devices),
    statusDistribution: calculateStatusDistribution(devices)
  };
}

function calculateDeviceTypes(devices: Device[]) {
  const typeCount = devices.reduce((acc, device) => {
    acc[device.type] = (acc[device.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(typeCount).map(([type, count]) => ({ type, count }));
}

function calculateTopBrands(devices: Device[]) {
  const brandCount = devices.reduce((acc, device) => {
    const brand = device.brand?.name || 'Unknown';
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(brandCount)
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function calculateStatusDistribution(devices: Device[]) {
  const statusCount = devices.reduce((acc, device) => {
    const status = device.device_status?.name || (device.active ? 'Active' : 'Inactive');
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(statusCount).map(([status, count]) => ({ status, count }));
}

// Solar System Component
const SolarSystemView = ({ 
  devices, 
  onDeviceSelect 
}: { 
  devices: Device[];
  onDeviceSelect: (device: Device) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedOrbit, setSelectedOrbit] = useState<number | null>(null);

  const getDeviceColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'laptop': return 'from-blue-500 to-cyan-400';
      case 'desktop': return 'from-purple-500 to-pink-400';
      case 'tablet': return 'from-green-500 to-emerald-400';
      case 'server': return 'from-red-500 to-orange-400';
      case 'mobile': return 'from-yellow-500 to-amber-400';
      default: return 'from-gray-500 to-gray-400';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'laptop': return <Laptop className="w-5 h-5" />;
      case 'desktop': return <Monitor className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      case 'server': return <Server className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const orbits = [
    { radius: '120px', duration: '20s' },
    { radius: '180px', duration: '30s' },
    { radius: '240px', duration: '40s' },
    { radius: '300px', duration: '50s' },
  ];

  return (
    <div ref={containerRef} className="relative w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-3xl overflow-hidden">
      {/* النجوم في الخلفية */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* الشمس في المركز */}
      <div className="absolute z-10 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl shadow-orange-500/50 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 animate-ping opacity-20" />
          <Sun className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white" />
        </div>
        <div className="mt-4 text-center">
          <div className="text-white font-bold text-lg">Data Center</div>
          <div className="text-yellow-200 text-sm">Core System</div>
        </div>
      </div>

      {/* المدارات والكواكب (الأجهزة) */}
      {orbits.map((orbit, orbitIndex) => (
        <div
          key={orbitIndex}
          className="absolute border border-gray-600/30 rounded-full"
          style={{
            width: `calc(${orbit.radius} * 2)`,
            height: `calc(${orbit.radius} * 2)`,
          }}
        >
          {/* خط المدار */}
          <div className="absolute inset-0 border border-blue-400/20 rounded-full" />
          
          {/* الأجهزة في هذا المدار */}
          {devices.slice(orbitIndex * 2, orbitIndex * 2 + 2).map((device, deviceIndex) => {
            const angle = (deviceIndex * 180) + (orbitIndex * 45);
            const isActive = device.active;
            
            return (
              <div
                key={device.id}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ${
                  selectedOrbit === orbitIndex ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  transform: `rotate(${angle}deg) translate(${orbit.radius}) rotate(-${angle}deg)`,
                }}
                onClick={() => onDeviceSelect(device)}
                onMouseEnter={() => setSelectedOrbit(orbitIndex)}
                onMouseLeave={() => setSelectedOrbit(null)}
              >
                {/* الكوكب */}
                <div className={`relative group ${
                  isActive ? 'animate-float' : 'opacity-60'
                }`}>
                  {/* الحلقات للكواكب المهمة */}
                  {(device.type === 'server' || device.type === 'desktop') && (
                    <div className="absolute -inset-4 border-2 border-gray-400/30 rounded-full animate-spin-slow" />
                  )}
                  
                  {/* الكوكب الرئيسي */}
                  <div className={`
                    w-16 h-16 rounded-full shadow-2xl transform transition-all duration-300 
                    group-hover:scale-110 group-hover:shadow-glow
                    bg-gradient-to-br ${getDeviceColor(device.type)}
                    ${isActive ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400'}
                  `}>
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      {getDeviceIcon(device.type)}
                    </div>
                    
                    {/* النقاط على السطح */}
                    <div className="absolute top-2 left-3 w-1 h-1 bg-white/30 rounded-full" />
                    <div className="absolute bottom-3 right-2 w-1 h-1 bg-white/30 rounded-full" />
                    <div className="absolute top-3 right-3 w-1 h-1 bg-white/30 rounded-full" />
                  </div>

                  {/* التوهج */}
                  <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-md group-hover:opacity-30 transition-opacity" />

                  {/* معلومات عند Hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap border border-gray-600">
                      <div className="font-bold">{device.serialNumber}</div>
                      <div className="text-gray-300 capitalize">{device.type}</div>
                      <div className={`text-xs ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                        {isActive ? '🟢 Active' : '🔴 Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* الإحصائيات في الزوايا */}
      <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-600">
        <div className="text-white font-bold text-lg">{devices.length} Devices</div>
        <div className="text-green-400 text-sm">{devices.filter(d => d.active).length} Active</div>
      </div>

      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-600">
        <div className="text-white text-sm">Solar System View</div>
        <div className="text-blue-400 text-xs">Real-time Monitoring</div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend 
}: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  trend?: { value: number; isPositive: boolean };
}) => (
  <Card className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </CardTitle>
      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {description}
        </p>
        {trend && (
          <span className={`text-xs font-medium ${
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.isPositive ? '↗' : '↘'} {trend.value}%
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function AnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [viewMode, setViewMode] = useState<"solar" | "grid" | "list">("solar");

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsData,
  });

  const filteredDevices = useMemo(() => {
    if (!analytics?.recentDevices) return [];
    
    return analytics.recentDevices.filter(device =>
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [analytics?.recentDevices, searchTerm]);

  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleEditDevice = (device: Device) => {
    console.log("Edit device:", device);
  };

  const handleCloseModal = () => {
    setSelectedDevice(null);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <div className="text-yellow-400 text-lg">Loading Solar System...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-600 dark:text-red-400 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Failed to load analytics</h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Orbit className="w-8 h-8 text-yellow-500" />
              Device Solar System
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Explore your devices in an interactive solar system view
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border">
              <Button 
                variant={viewMode === "solar" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("solar")}
                className="flex items-center gap-2"
              >
                <Orbit className="w-4 h-4" />
                Solar
              </Button>
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Planets"
            value={analytics?.totalDevices || 0}
            icon={Orbit}
            description="In the system"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Orbits"
            value={analytics?.activeDevices || 0}
            icon={Zap}
            description="Currently active"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Galaxies"
            value={analytics?.deviceTypes?.length || 0}
            icon={Network}
            description="Device categories"
          />
          <StatsCard
            title="Constellations"
            value={analytics?.topBrands?.length || 0}
            icon={Cloud}
            description="Brand groups"
          />
        </div>

        {/* Main Content */}
        {viewMode === "solar" ? (
          <SolarSystemView 
            devices={filteredDevices} 
            onDeviceSelect={handleViewDevice}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Device List View</CardTitle>
              <CardDescription>
                Traditional list view of all devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleViewDevice(device)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        device.active ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <div>
                        <div className="font-semibold">{device.serialNumber}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {device.type} • {device.brand?.name}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDevice(device);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Device Details Modal */}
        {selectedDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Planet Details - {selectedDevice.serialNumber}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCloseModal}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Planetary Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Serial Number:</span>
                        <span className="font-medium">{selectedDevice.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="font-medium capitalize">{selectedDevice.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                        <span className="font-medium">{selectedDevice.brand?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Model:</span>
                        <span className="font-medium">{selectedDevice.deviceModel?.name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Planetary Specifications
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Processor:</span>
                        <span className="font-medium text-sm">{selectedDevice.cpu?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                        <span className="font-medium">
                          {selectedDevice.memory ? `${selectedDevice.memory.size} ${selectedDevice.memory.type}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Graphics:</span>
                        <span className="font-medium text-sm">{selectedDevice.graphicCard?.model || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Purchase Date:</span>
                        <span className="font-medium">{selectedDevice.purchaseDateFormatted}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Orbital Status
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedDevice.active 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}>
                      {selectedDevice.active ? '🟢 Active Orbit' : '🔴 Inactive Orbit'}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Status: {selectedDevice.device_status?.name || 'Active'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Close Orbit
                  </Button>
                  <Button onClick={() => handleEditDevice(selectedDevice)}>
                    Edit Planet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* إضافة الـ CSS للحركات */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .shadow-glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </MainLayout>
  );
}