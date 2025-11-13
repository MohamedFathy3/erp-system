// app/device-models/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="organization"
      title="Organizations"
      columns={[
        { 
          key: 'code', 
          label: 'code', 
          sortable: true,
       
        },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'ArabicName', label: 'Arabic Name', sortable: false },
        { 
          key: 'outgoing_server', 
          label: 'Outgoing Server', 
          sortable: true,
        },
        { key: 'port', label: 'Port', sortable: false },
        { 
          key: 'ssl', 
          label: 'SSL', 
          sortable: false,
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.ssl 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {item.ssl ? 'Enabled' : 'Disabled'}
            </span>
          )
        },
        { 
          key: 'logo', 
          label: 'Logo', 
          sortable: false,
          render: (item) => (
            <div className="flex justify-center">
              {item.logo ? (
                <img 
                  src={item.logo} 
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center border border-gray-200">
                  <span className="text-gray-600 text-sm font-medium">
                    No Logo
                  </span>
                </div>
              )}
            </div>
          )
        },
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
          required: true,
          placeholder: 'Enter organization name'
        },
        { 
          name: 'ArabicName', 
          label: 'Arabic Name', 
          type: 'text', 
          required: false,
          placeholder: 'Enter Arabic name'
        },
        {
          name: "outgoing_server",
          label: "Outgoing Server",
          type: "text",
          placeholder: "Enter outgoing server address"
        },
        {
          name: "port",
          label: "Port",
          type: "number",
          placeholder: "Enter port number"
        },
        {
          name: "ssl",
          label: "SSL",
          type: "select",
          options: [
            { value: '1', label: 'Enabled' },
            { value: '0', label: 'Disabled' }
          ],
          defaultValue: 'true'
        },
        {
          name: "logo",
          label: "Logo",
          type: "image",
          required: false
        }
      ]}
      // لمنع الفلترز
      availableFilters={[]}
    />
  );
}