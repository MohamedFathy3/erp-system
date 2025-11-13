'use client';
import { useRef, useCallback } from "react";
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { smartTranslate } from '@/utils/translations';

export default function TicketETAPage() {
  // 🔹 استخدام useRef لتخزين آخر ID مستخدم
  const lastIdRef = useRef(0);

  // 🔹 دالة لتوليد ID فريد
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateId = useCallback((item: any) => {
    const ep = "graphic-card";
    const firstLetter = ep[0]?.toUpperCase() || 'G';
    const lastLetter = ep[ep.length - 1]?.toUpperCase() || 'C';
    
    const namePrefix = item.model ? item.model.slice(0, 2).toUpperCase() : "NA";
    
    // استخدام الـ ID الحقيقي من البيانات إذا موجود، وإلا نستخدم counter
    const itemId = item.id || ++lastIdRef.current;
    const num = String(itemId).padStart(3, '0');
    
    return `${firstLetter}${lastLetter}${namePrefix}${num}`;
  }, []);

  return (
    <GenericDataManager
      endpoint="graphic-card"
      title="Graphic Cards"
      columns={[
        { 
          key: 'code', 
          label: 'code', 
          sortable: true,
        },
        { key: 'model', label: 'Model', sortable: true },
        { key: 'vram', label: 'VRAM', sortable: false },
        { 
          key: 'arabicName', 
          label: 'Arabic Name', 
          sortable: false,
          render: (item) => {
            // 🔹 استخدام item.model بدل item.name
            const arabicName = smartTranslate(item.model || '');
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
        { 
          name: 'model', 
          label: 'Model', 
          type: 'text', 
          required: true 
        },
        { 
          name: 'vram', 
          label: 'VRAM', 
          type: 'text', 
          required: true 
        },
        // 🔹 إزالة الحقل 'Arabic' إذا لم يكن موجود في الـ API
      ]}
      initialData={{}}
      defaultFilters={{}}
    />
  );
}