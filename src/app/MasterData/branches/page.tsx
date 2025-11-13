// app/device-models/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="branch"
      title="Branches"
      columns={[
        { 
          key: 'code', 
          label: 'code', 
          sortable: true,
          
        },
        { 
          key: 'name',  
          label: 'Name', 
          sortable: true 
        },
        { 
          key: 'code', 
          label: 'Code', 
          sortable: false,
          render: (item) => item.code || 'N/A'
        },
        { 
          key: 'local_name', 
          label: 'Local Name', 
          sortable: false,
          render: (item) => item.local_name || 'N/A'
        },
        { 
          key: 'phone', 
          label: 'Phone', 
          sortable: false,
          render: (item) => item.phone || 'N/A'
        },
   
        { 
          key: 'mobile', 
          label: 'Mobile', 
          sortable: false,
          render: (item) => item.mobile || 'N/A'
        },
 
      
      
  
        { 
          key: 'active', 
          label: 'Status', 
          sortable: false,
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.active 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {item.active ? 'Active' : 'Inactive'}
            </span>
          )
        },
      
      ]}
     
      // APIs إضافية للـ dropdowns
      additionalData={[
        { key: 'company', endpoint: '/company' },
        { key: 'city', endpoint: '/city' },
        { key: 'country', endpoint: '/country' },
      ]}
     
      formFields={[
          { 
          name: 'code', 
          label: 'code', 
          type: 'text', 
          required: true,
          placeholder: 'Enter code '
        },
        { 
          name: 'name', 
          label: 'Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter branch name'
        },
        { 
          name: 'code', 
          label: 'Code', 
          type: 'text', 
          required: false,
          placeholder: 'Enter branch code'
        },
        { 
          name: 'local_name', 
          label: 'Local Name', 
          type: 'text', 
          required: false,
          placeholder: 'Enter local name'
        },
        { 
          name: 'phone', 
          label: 'Phone', 
          type: 'text', 
          required: false,
          placeholder: 'Enter primary phone'
        },
        { 
          name: 'phone_two', 
          label: 'Phone Two', 
          type: 'text', 
          required: false,
          placeholder: 'Enter secondary phone'
        },
        { 
          name: 'mobile', 
          label: 'Mobile', 
          type: 'text', 
          required: false,
          placeholder: 'Enter mobile number'
        },
        { 
          name: 'fax', 
          label: 'Fax', 
          type: 'text', 
          required: false,
          placeholder: 'Enter fax number'
        },
        { 
          name: 'address', 
          label: 'Address', 
          type: 'text', 
          required: false,
          placeholder: 'Enter address'
        },
        { 
          name: 'zip_code', 
          label: 'Zip Code', 
          type: 'text', 
          required: false,
          placeholder: 'Enter zip code'
        },
        { 
          name: 'alias_name', 
          label: 'Alias Name', 
          type: 'text', 
          required: false,
          placeholder: 'Enter alias name'
        },
        { 
          name: 'notes', 
          label: 'Notes', 
          type: 'textarea', 
          required: false,
          placeholder: 'Enter notes',
          rows: 3
        },
       
        {
          name: "company_id",
          label: "Company",
          type: "select",
          optionsKey: "company",
          required: true
        },
        {
          name: "city_id",
          label: "City",
          type: "select",
          optionsKey: "city",
          required: false
        },
        {
          name: "country_id",
          label: "Country",
          type: "select",
          optionsKey: "country",
          required: false
        },
  
      ]}
      availableFilters={[]}
    />
  );
}