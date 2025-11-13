// app/device-models/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";



export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="device-status"
      title="Device status"
      columns={[
        { 
          key: 'code', 
          label: 'code', 
          sortable: true,
      
        },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        { key: 'ArabicName', label: 'Arabic Name', sortable: false },
      ]}
      formFields={[
              { 
          name: 'code', 
          label: 'code', 
          type: 'text', 
          required: true 
        },
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