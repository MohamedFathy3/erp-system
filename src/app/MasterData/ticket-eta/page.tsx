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
          key: 'id', 
          label: 'ID', 
          sortable: true
        },
        { key: 'name', label: 'Name', sortable: true },
        { 
          key: 'Arabic', 
          label: 'Arabic Name', 
          sortable: false,
          render: (item) => {
            const arabicName = smartTranslate(item.name);
            return (
              <div className="flex flex-col">
                <span className="text-gray-800 dark:text-gray-200">{arabicName}</span>
                {arabicName.includes('(غير مترجم)') && (
                  <span className="text-xs text-gray-500">ترجمة تلقائية</span>
                )}
              </div>
            );
          }
        },
        { key: 'type_id', label: 'Type ID', sortable: false },
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
      formFields={[
        { 
          name: 'name', 
          label: 'Name', 
          type: 'text', 
          required: true 
        },
        { 
          name: 'Arabic', 
          label: 'Arabic Name', 
          type: 'text', 
          required: false 
        },
        { 
          name: 'time', 
          label: 'Time (HH:MM)', 
          type: 'text', 
          required: true,
        },
        { 
          name: 'short_description', 
          label: 'Short Description', 
          type: 'text', 
          required: false 
        },
      ]}
      initialData={{ type_id: 8 }}
      defaultFilters={{ type_id: '8' }}
    />
  );
}