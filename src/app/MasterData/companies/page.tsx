// app/device-models/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="company"
      title="Company"
      columns={[
        { 
          key: 'code', 
          label: 'code', 
          sortable: true,
          render: (item) => {
            const ep = "Company";
            const firstLetter = ep[0]?.toUpperCase() || 'D';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'D';
            return `${firstLetter}${lastLetter}${String(item.id).padStart(3, '0')}`;
          }
        },
        { 
          key: 'name', 
          label: 'Name', 
          sortable: true 
        },
        { 
          key: 'ArabicName', 
          label: 'Arabic Name', 
          sortable: false,
          render: (item) => item.ArabicName || 'N/A'
        },
        { 
          key: 'phone', 
          label: 'Phone', 
          sortable: false,
          render: (item) => item.phone || 'N/A'
        },
        { 
          key: 'email', 
          label: 'Email', 
          sortable: false,
          render: (item) => item.email || 'N/A'
        },
        { 
          key: 'avatar', 
          label: 'Avatar', 
          sortable: false,
          render: (item) => (
            <div className="flex justify-center">
              {item.avatar ? (
                <img 
                  src={item.avatar} 
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center border border-gray-200">
                  <span className="text-gray-600 text-xs font-medium">
                    No Avatar
                  </span>
                </div>
              )}
            </div>
          )
        },
        { 
          key: 'type', 
          label: 'Type', 
          sortable: false,
          render: (item) => item.type || 'N/A'
        },
        { 
          key: 'organization', 
          label: 'Organization', 
          sortable: false,
          render: (item) => {
            // Check if organization is an object with name property
            if (typeof item.organization === 'object' && item.organization !== null && 'name' in item.organization) {
              return item.organization.name;
            }
            // If it's a string or has organizationId
            return item.organization || item.organizationId || 'N/A';
          }
        },
      ]}
     
      // APIs إضافية للـ dropdowns
      additionalData={[
        { key: 'cities', endpoint: '/city' },
        { key: 'countries', endpoint: '/country' },
        { key: 'organizations', endpoint: '/organization' }
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
          name: 'avatar', 
          label: 'Company Logo/Avatar', 
          type: 'file', 
          required: false,
          accept: 'image/*',
          multiple: false
        },
        { 
          name: 'name', 
          label: 'Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter company name'
        },
        { 
          name: 'ArabicName', 
          label: 'Arabic Name', 
          type: 'text', 
          required: false,
          placeholder: 'Enter Arabic name'
        },
        { 
          name: 'phone', 
          label: 'Phone', 
          type: 'text', 
          required: false,
          placeholder: 'Enter phone number'
        },
        { 
          name: 'address', 
          label: 'Address', 
          type: 'text', 
          required: false,
          placeholder: 'Enter address'
        },
        { 
          name: 'email', 
          label: 'Email', 
          type: 'email', 
          required: false,
          placeholder: 'Enter email address'
        },
        { 
          name: 'website', 
          label: 'Website', 
          type: 'url', 
          required: false,
          placeholder: 'Enter website URL'
        },
        { 
          name: 'type', 
          label: 'Type', 
          type: 'select',
          options: [
            { value: 'branch', label: 'Branch' },
            { value: 'headquarters', label: 'Headquarters' },
            { value: 'subsidiary', label: 'Subsidiary' }
          ],
          required: true
        },
        {
          name: "city_id",
          label: "City",
          type: "select",
          optionsKey: "cities",
          required: false
        },
        {
          name: "country_id",
          label: "Country",
          type: "select",
          optionsKey: "countries",
          required: false
        },
        {
          name: "organizationId",
          label: "Organization",
          type: "select",
          optionsKey: "organizations",
          required: true
        }
      ]}
      
      initialData={{ 
        // type: 'branch',
      }}
      availableFilters={[]}
    />
  );
}