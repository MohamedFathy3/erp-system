// app/device-models/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="type"
      title="Device Types"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "DeviceType".split(''); // Example endpoint name
            const firstLetter = ep[0]?.toUpperCase() || 'D';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'D';
            
            const randomId = Math.floor(1 + Math.random() * 999).toString().padStart(3, '0');
            return `${firstLetter}${lastLetter}${randomId}`;
          }
        },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'ArabicName', label: 'Arabic Name', sortable: false },
        { key: 'type', label: 'Type', sortable: false },
      ]}
      formFields={[
        { 
          name: 'name', 
          label: 'Name', 
          type: 'text', 
          required: true 
        },
        { 
          name: 'ArabicName', 
          label: 'Arabic Name', 
          type: 'text', 
          required: false 
        },
      ]}
      initialData={{ type: 'device' }} 
      defaultFilters={{ type: 'device' }} 
    />
  );
}