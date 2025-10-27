// app/device-models/page.tsx
'use client';

import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="country"
      title="Countries"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "country";
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
          key: 'code', 
          label: 'Code', 
          sortable: false 
        },
     { 
  key: 'key', 
  label: 'Phone Code', 
  sortable: false,
  render: (item) => `+${item.key}`  // هنا بنضيف علامة + قبل الرقم
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
        { 
          key: 'imageUrl', 
          label: 'Flag', 
          sortable: false,
          render: (item) => (
            <div className="flex justify-center">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={`${item.name} flag`}
                  className="w-8 h-6 object-cover border border-gray-200 rounded"
                />
              ) : (
                <div className="w-8 h-6 rounded bg-gray-300 flex items-center justify-center border border-gray-200">
                  <span className="text-gray-600 text-xs">No Flag</span>
                </div>
              )}
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