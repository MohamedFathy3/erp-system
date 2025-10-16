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
        { key: 'name', label: 'Name', sortable: true },
        { 
          key: 'short_description', 
          label: 'Description', 
          sortable: false,
         
        },
        { 
          key: 'type_id', 
          label: 'Type', 
          sortable: true,
        
        },
        { 
          key: 'priority', 
          label: 'Priority', 
          sortable: true,
          render: (item) => {
            const priorityColors = {
              'Low': 'bg-green-100 text-green-800',
              'Medium': 'bg-yellow-100 text-yellow-800',
              'High': 'bg-orange-100 text-orange-800',
              'Critical': 'bg-red-100 text-red-800'
            };
            const colorClass = priorityColors[item.priority] || 'bg-gray-100 text-gray-800';
            
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                {item.priority}
              </span>
            );
          }
        },
        { 
          key: 'time', 
          label: 'Time', 
          sortable: true,
          render: (item) => {
            if (!item.time) return "";
            const parts = item.time.split(':');
            return `${parts[0]}:${parts[1]}`;
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