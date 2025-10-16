// app/device-models/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="city"
      title="City"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "city";
            const firstLetter = ep[0]?.toUpperCase() || 'C';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'Y';
            return `${firstLetter}${lastLetter}${String(item.id).padStart(3, '0')}`;
          }
        },
        { 
          key: 'name', 
          label: 'Name', 
          sortable: false 
        },
     
        { 
          key: 'Locode', 
          label: 'Locode Code', 
          sortable: false 
        },
        { 
          key: 'country', 
          label: 'country', 
          sortable: true,
          render: (item) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const country = item.country as any;
            return (typeof country === 'string' ? country : country?.name) || 'N/A';
          }
        },
        { 
          key: 'active', 
          label: 'Active', 
          sortable: false,
          render: (item) => (
            <div className="flex justify-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.active 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {item.active ? '✓' : '✗'}
              </div>
            </div>
          )
        },
    
      ]}
showAddButton={false}
      showEditButton={false}
      showDeleteButton={false}
      showActiveToggle={true}
      showSearch={false}
      showFilter={false}
      showBulkActions={false}
      showDeletedToggle={false}
      
      formFields={[]}

    />
  );
}