'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
interface SelectInputProps {
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const SelectInput = ({ label, value, options, onChange }: SelectInputProps) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-md border dark:bg-gray-800 p-2"
    >
      <option value="">Select {label}</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default function AddDeviceModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    serial: '',
    type: '',
    condition: '',
    brand: '',
    model: '',
    status: '',
    processor: '',
    ram: '',
    gpu: '',
    purchaseDate: '',
    warrantyDate: '',
    note: ''
  });

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold">Add New Device</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Serial Number" value={form.serial} onChange={(e) => handleChange('serial', e.target.value)} />
          <SelectInput label="Type" value={form.type} onChange={(e) => handleChange('type', e.target.value)} options={['Laptop', 'Desktop']} />
          <SelectInput label="Condition" value={form.condition} onChange={(e) => handleChange('condition', e.target.value)} options={['New', 'Used']} />
          <SelectInput label="Brand" value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} options={['Dell', 'HP', 'Lenovo']} />
          <Input placeholder="Model" value={form.model} onChange={(e) => handleChange('model', e.target.value)} />
          <SelectInput label="Device Status" value={form.status} onChange={(e) => handleChange('status', e.target.value)} options={['Active', 'Retired']} />
          <Input placeholder="Processor" value={form.processor} onChange={(e) => handleChange('processor', e.target.value)} />
          <Input placeholder="RAM (e.g., 16GB)" value={form.ram} onChange={(e) => handleChange('ram', e.target.value)} />
          <Input placeholder="GPU" value={form.gpu} onChange={(e) => handleChange('gpu', e.target.value)} />
          <Input type="date" placeholder="Purchase Date" value={form.purchaseDate} onChange={(e) => handleChange('purchaseDate', e.target.value)} />
          <Input type="date" placeholder="Warranty Expiry Date" value={form.warrantyDate} onChange={(e) => handleChange('warrantyDate', e.target.value)} />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Note</label>
          <textarea
            rows={3}
            className="w-full rounded-md border p-2 dark:bg-gray-800"
            value={form.note}
            onChange={(e) => handleChange('note', e.target.value)}
          />
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { alert('Saved'); onClose(); }}>Save</Button>
        </div>
      </div>
    </div>
  );
}
