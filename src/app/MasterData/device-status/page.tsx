// app/device-models/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

// counter خارجي علشان يحافظ على القيمة
let idCounter = 1;

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="device-status"
      title="Device status"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "device-status";
            const firstLetter = ep[0]?.toUpperCase() || 'D';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'D';
            
            const sequentialId = idCounter.toString().padStart(3, '0');
            idCounter++; // يزيد واحد لكل صف
            return `${firstLetter}${lastLetter}${sequentialId}`;
          }
        },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        { key: 'ArabicName', label: 'Arabic Name', sortable: false },
      ]}
      formFields={[
        { 
          name: 'name', 
          label: 'Name', 
          type: 'text', 
          required: true 
        },
           { 
          name: 'description', 
          label: 'Description', 
          type: 'text', 
          required: false 
        },
        { 
          name: 'ArabicName', 
          label: 'Arabic Name', 
          type: 'text', 
          required: false 
        },
      ]}
    />
  );
}