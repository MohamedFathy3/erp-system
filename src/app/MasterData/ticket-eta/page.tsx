// app/ticket-eta/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { smartTranslate } from '@/utils/translations';

export default function TicketETAPage() {
  return (
    <GenericDataManager
      endpoint="category"
      title="Ticket ETA"
      columns={[
        { 
          key: 'code', 
          label: 'Code', 
          sortable: false
        },
        { 
          key: 'name', 
          label: 'Name', 
          sortable: true,
          render: (item) => (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="text-sm text-gray-500 mt-1">
                {item.type_id}
              </span>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.priority === 'Low' ? 'bg-green-100 text-green-800' :
                  item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                  item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.priority}
                </span>
              </div>
            </div>
          )
        },
        { 
          key: 'short_description', 
          label: 'Description', 
          sortable: false,
        },
        { 
          key: 'time', 
          label: 'Time', 
          sortable: true,
          render: (item) => {
            if (!item.time) return "";
            const parts = item.time.split(':');
            return (
              <div className="text-center">
                <span className="font-semibold text-gray-900">
                  {`${parts[0]}:${parts[1]}`}
                </span>
                <div className="text-xs text-gray-500 mt-1">hours</div>
              </div>
            );
          }
        },
      ]}
      additionalData={[
        { key: 'type', endpoint: '/type' }
      ]}
      formFields={[
        { 
          name: 'code', 
          label: 'Code', 
          type: 'text', 
          required: true,
          placeholder: 'Enter unique code'
        },
        { 
          name: 'name', 
          label: 'Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter issue name'
        },
        { 
          name: 'Arabic', 
          label: 'Arabic Name', 
          type: 'text', 
          required: false,
          placeholder: 'ادخل الاسم العربي'
        },
        {
          name: "type_id",
          label: "IT Issue Categories",
          type: "select",
          required: true,
          optionsKey: "type",
          placeholder: "Select type"
        },
        {
          name: "priority",
          label: "Priority",
          type: "select",
          required: true,
          options: [
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Critical', label: 'Critical' }
          ],
          placeholder: "Select priority level"
        },
        { 
          name: 'time', 
          label: 'Time (HH:MM)', 
          type: 'text', 
          required: true,
          placeholder: '00:00'
        },
        { 
          name: 'short_description', 
          label: 'Short Description', 
          type: 'text',
          rows: 3,
          required: false,
          placeholder: 'Enter short description'
        },
      ]}
      initialData={{ 
      }}
      defaultFilters={{ 
      }}
    />
  );
}