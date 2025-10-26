// app/ticket-eta/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

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
    const totalMinutes = parseInt(h, 10) * 60 + parseInt(m, 10);
    
    // نحسب الأيام والساعات والدقايق
    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutes = totalMinutes % (24 * 60);
    const displayHours = Math.floor(remainingMinutes / 60);
    const displayMinutes = remainingMinutes % 60;

    // نعرضها بالشكل المطلوب
    return (
      <div className="text-center text-xs font-mono text-gray-800 space-y-1">
        {/* الجزء العلوي: الشكل البصري */}
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-base font-bold">{String(days).padStart(2, '0')}</span>
          <span className="text-gray-400">/</span>
          <span className="text-base font-bold">{String(displayHours).padStart(2, '0')}</span>
          <span className="text-gray-400">:</span>
          <span className="text-base font-bold">{String(displayMinutes).padStart(2, '0')}</span>
        </div>

        {/* الجزء السفلي: التسميات */}
        <div className="text-[10px] text-gray-500 tracking-wider">
          D / H : Min
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
  label: 'ETA Time', 
  type: 'custom' as const, // ✅ type يكون custom
  component: 'time-selector' as const, // ✅ component يكون time-selector
  required: true,
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
