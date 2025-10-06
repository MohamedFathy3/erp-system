'use client';
import { useRef } from "react";
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { smartTranslate } from '@/utils/translations';

export default function TicketETAPage() {
  // 🔹 عدّاد لتوليد أرقام متسلسلة
  const counterRef = useRef(0);

  return (
    <GenericDataManager
      endpoint="graphic-card"
      title="Graphic Cards"
      columns={[
        { 
          key: 'id', 
          label: 'ID', 
          sortable: true,
          render: (item) => {
            const ep = "graphic-card";
            const firstLetter = ep[0]?.toUpperCase() || 'G';
            const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'D';

            // 🔹 زوّد العدّاد واحد كل مرة
            counterRef.current += 1;
            const num = counterRef.current.toString().padStart(3, '0'); // مثل 001, 002, 003
            
            const namePrefix = item.name ? item.name.slice(0, 2).toUpperCase() : "NA";
            return `${firstLetter}${lastLetter}${namePrefix}${num}`;
          }
        },
        { key: 'model', label: 'Model', sortable: true },
        { key: 'vram', label: 'VRAM', sortable: false },

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
        { name: 'Arabic', label: 'Arabic Name', type: 'text', required: false },
        { name: 'model', label: 'Model', type: 'text', required: true },
        { name: 'vram', label: 'VRAM', type: 'text', required: true },
      ]}
      initialData={{ }}
      defaultFilters={{}}
    />
  );
}
