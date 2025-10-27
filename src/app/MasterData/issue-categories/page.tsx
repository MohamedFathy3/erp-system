// app/device-models/page.tsx
'use client';

import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="type"
      title="IT Issue Categories"
      columns={[
                { key: 'code', label: 'code', sortable: false },
        { key: 'name', label: 'Name', sortable: true },
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
          name: 'ArabicName', 
          label: 'Arabic Name', 
          type: 'text', 
          required: false 
        },
      ]}
      initialData={{ type: 'issue' }} // علشان يبعت type عند الحفظ
      defaultFilters={{ type: 'issue' }} // علشان يفلتر البيانات حسب type
    />
  );
}