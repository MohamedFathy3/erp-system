'use client';
import { useRef } from "react";
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { smartTranslate } from '@/utils/translations';

export default function TicketETAPage() {
  const counterRef = useRef(0);

  return (
    <GenericDataManager
      endpoint="brand"
      title="IT Brands"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "brand";
            const firstLetter = ep[0]?.toUpperCase() || 'B';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'D';

            counterRef.current += 1;
            const num = counterRef.current.toString().padStart(3, '0'); // مثل 001, 002, 003
            
            const namePrefix = item.name ? item.name.slice(0, 2).toUpperCase() : "NA";
            return `${firstLetter}${lastLetter}${namePrefix}${num}`;
          }
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
      ]}
      formFields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'Arabic', label: 'Arabic Name', type: 'text', required: false },
        { name: 'type', label: 'Type', type: 'text', required: true },
      ]}
      initialData={{ }}
      defaultFilters={{  }}
    />
  );
}
