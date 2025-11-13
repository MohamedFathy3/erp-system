'use client';
import { useRef } from "react";
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { smartTranslate } from '@/utils/translations';

export default function TicketETAPage() {
  // 🔹 عدّاد لتوليد أرقام متسلسلة
  const counterRef = useRef(0);

  return (
    <GenericDataManager
      endpoint="memory"
      title="Memory"
      columns={[
        { 
          key: 'code', 
          label: 'code', 
          sortable: true,
    
        },
        { key: 'size', label: 'Size', sortable: true },
        { key: 'type', label: 'Type ID', sortable: false },

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
      ]}
      formFields={[
              { 
          name: 'code', 
          label: 'code', 
          type: 'text', 
          required: true 
        },
        { name: 'Arabic', label: 'Arabic Name', type: 'text', required: false },
        { name: 'size', label: 'Size', type: 'text', required: true },
        { name: 'type', label: 'Type', type: 'text', required: true },
      ]}
      initialData={{ }}
      defaultFilters={{}}
    />
  );
}
