// app/device-models/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="department"
      title="Department"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "Department";
            const firstLetter = ep[0]?.toUpperCase() || 'D';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'D';
            const id = item.id.toString().padStart(3, '0');
            return `${firstLetter}${lastLetter}${id}`;
          }
        },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'ArabicName', label: 'Arabic Name', sortable: false },
        { key: 'description', label: 'Description', sortable: false },

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
          { 
          name: 'description', 
          label: 'Description', 
          type: 'text', 
          required: false 
        },
      ]}
    />
  );
}