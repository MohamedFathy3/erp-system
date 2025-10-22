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
          sortable: false,
          render: (item) => (
            <span className="text-xs text-gray-900">{item.code}</span>
          )
        },
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          render: (item) => (
            <div className="flex items-center justify-between gap-4 text-xs">
              {/* الاسم والنوع تحت بعض */}
              <div className="flex flex-col justify-center text-gray-900">
                <span className="font-medium">{item.name}</span>
                {(item.type?.name || item.typeName) && (
                  <span className="text-gray-500">{item.type?.name || item.typeName}</span>
                )}
              </div>

              {/* الأولوية */}
              {item.priority && (
                <span
                  className={`min-w-[70px] text-center inline-flex items-center justify-center px-2 py-1 rounded-full font-medium
                    ${
                      item.priority === 'Low' ? 'bg-green-100 text-green-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                >
                  {item.priority}
                </span>
              )}
            </div>
          )
        },
        { 
          key: 'short_description', 
          label: 'Description', 
          sortable: false,
          render: (item) => (
            <div className="text-left min-w-[250px] max-w-[500px] text-xs">
              {item.short_description ? (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed line-clamp-3">
                    {item.short_description}
                  </p>
                  {item.short_description.length > 100 && (
                    <button 
                      className="text-blue-600 mt-2 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(item.short_description);
                      }}
                    >
                      Show more
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 italic bg-gray-50 rounded-lg p-3 text-center">
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

    const [h = '00', m = '00', s = '00'] = item.time.split(':');
    const hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);

    // تحويل الوقت لأيام وساعات ودقايق
    const totalMinutes = hours * 60 + minutes;
    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutes = totalMinutes % (24 * 60);
    const displayHours = Math.floor(remainingMinutes / 60);
    const displayMinutes = remainingMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (displayHours > 0) parts.push(`${displayHours} hour${displayHours > 1 ? 's' : ''}`);
    if (displayMinutes > 0) parts.push(`${displayMinutes} minute${displayMinutes > 1 ? 's' : ''}`);

    return (
      <div className="text-center text-xs space-y-1">
        {/* الوقت المفصل */}
        <div className="text-gray-900 font-semibold">
          {parts.length > 0 ? parts.join(', ') : '0 minutes'}
        </div>

        {/* الوقت الأصلي */}
        <div className="text-gray-500">
          Raw: {`${h.padStart(2, '0')}:${m.padStart(2, '0')}`}
        </div>

        {/* المجموع الإجمالي بالساعات */}
        <div className="text-gray-400 text-[10px] italic">
          Total: {(totalMinutes / 60).toFixed(2)} hrs
        </div>
      </div>
    );
  }
}
,
      ]}
      additionalData={[
        { 
          key: 'type', 
          endpoint: '/type', 
          filters: { type: 'issue' } 
        }
      ]}
      formFields={[
        { 
          name: 'code', 
          label: 'Code', 
          type: 'text', 
          required: true,
          placeholder: 'Enter unique code',
        },
        { 
          name: 'name', 
          label: 'Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter issue name',
        },
        { 
          name: 'Arabic', 
          label: 'Arabic Name', 
          type: 'text', 
          required: false,
          placeholder: 'ادخل الاسم العربي',
        },
        {
          name: "type_id",
          label: "IT Issue Categories",
          type: "select",
          required: true,
          optionsKey: "type",
          placeholder: "Select type",
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
          placeholder: "Select priority level",
        },
        { 
          name: 'time', 
          label: 'Time', 
          type: 'custom-time',
          required: true,
          placeholder: 'HH:MM',
        },
        { 
          name: 'short_description', 
          label: 'Short Description', 
          type: 'textarea',
          rows: 3,
          required: false,
          placeholder: 'Enter short description',
        },
      ]}
    />
  );
}
