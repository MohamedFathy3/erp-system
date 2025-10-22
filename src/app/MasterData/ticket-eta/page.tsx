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
    <div className="flex items-center gap-3">
      {/* الاسم */}
      <span className="font-medium text-gray-900">{item.name}</span>
      
      {/* النوع */}
      {item.type?.name || item.typeName ? (
        <span className="text-sm text-gray-500 border-l border-gray-300 pl-3">
          {item.type?.name || item.typeName}
        </span>
      ) : null}
      
      {/* الأولوية */}
      {item.priority ? (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          item.priority === 'Low' ? 'bg-green-100 text-green-800' :
          item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
          item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.priority}
        </span>
      ) : null}
    </div>
  )
},
       { 
  key: 'short_description', 
  label: 'Description', 
  sortable: false,
  render: (item) => (
    <div className="text-left min-w-[250px] max-w-[500px]">
      {item.short_description ? (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3"> {/* يظهر 3 أسطر فقط */}
            {item.short_description}
          </p>
          {item.short_description.length > 100 && (
            <button 
              className="text-blue-600 text-xs mt-2 hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                // إظهار الوصف كامل في modal أو tooltip
                alert(item.short_description);
              }}
            >
              Show more
            </button>
          )}
        </div>
      ) : (
        <div className="text-gray-400 text-sm italic bg-gray-50 rounded-lg p-3 text-center">
          No description available
        </div>
      )}
    </div>
  )
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
                <div className="text-xs text-gray-500 mt-1">Time</div>
              </div>
            );
          }
        },
      ]}
      additionalData={[
        { 
          key: 'type', 
          endpoint: '/type', 
          filters: { 
            "type": 'issue'  // أو 'issue' أو 'ticket'
          } 
        }
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
  label: 'Time', 
  type: 'custom-time', // ✅ غير النوع لـ time
  required: true,
  placeholder: 'HH:MM'
},
        { 
          name: 'short_description', 
          label: 'Short Description', 
          type: 'textarea',
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