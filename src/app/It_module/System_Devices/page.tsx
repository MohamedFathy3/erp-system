'use client';

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import AddDeviceModal from '@/components/AddDeviceModal';

const devices = [
  {
    id: 1,
    serialNumber: 'SN123456',
    type: 'Laptop',
    condition: 'New',
    brand: 'Dell',
    model: 'Inspiron 15',
    status: 'Active',
    processor: 'Intel Core i7',
    ram: '16GB',
    gpu: 'GTX 1650',
    purchaseDate: '2024-01-01',
    warrantyExpiry: '2026-01-01',
  },
];

export default function SystemDevicesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Devices</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your system devices</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>+ Add Device</Button>
        </div>

        {/* Table */}
     <div className="w-full overflow-x-auto rounded-lg shadow ring-1 ring-black/5">
  <table className="min-w-[1000px] table-auto divide-y divide-white dark:divide-gray-700">
    <thead className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-semibold">
      <tr>
        {[
          'Serial Number', 'Type', 'Condition', 'Brand', 'Model', 'Status',
          'Processor', 'RAM', 'GPU', 'Purchase Date', 'Warranty Expiry'
        ].map((col) => (
          <th key={col} className="px-5 py-3 text-left whitespace-nowrap">{col}</th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-white dark:divide-gray-800 text-sm">
      {devices.map((device) => (
        <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
          <td className="px-5 py-2 whitespace-nowrap">{device.serialNumber}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.type}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.condition}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.brand}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.model}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.status}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.processor}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.ram}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.gpu}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.purchaseDate}</td>
          <td className="px-5 py-2 whitespace-nowrap">{device.warrantyExpiry}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>

      {modalOpen && <AddDeviceModal onClose={() => setModalOpen(false)} />}
    </MainLayout>
  );
}


export async function GetStaticProps() {
  return {
    props: {}, 
    revalidate: 86400 
  }
}