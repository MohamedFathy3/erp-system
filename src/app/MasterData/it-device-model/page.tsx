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
          key: 'code', 
          label: 'code', 
          sortable: true,
       
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