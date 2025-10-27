// app/device-models/page.tsx
'use client';

import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="device-model"
      title="Device Models"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "device-model";
            const firstLetter = ep[0]?.toUpperCase() || 'D';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'D';
            return `${firstLetter}${lastLetter}${String(item.id).padStart(3, '0')}`;
          }
        },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'ArabicName', label: 'Arabic Name', sortable: false },
        { 
          key: 'brand', 
          label: 'Brand', 
          sortable: true,
          render: (item) => item.brand?.name || 'N/A'
        },
      ]}
      additionalData={[
        { key: 'brands', endpoint: '/brand' }
      ]}
      formFields={[
        { 
          name: 'name', 
          label: 'Name', 
          type: 'text', 
          required: true 
        },
        {
          name: "brandId",
          label: "Brand",
          type: "select",
          required: true,
          optionsKey: "brands",
        }
      ]}
    />
  );
}