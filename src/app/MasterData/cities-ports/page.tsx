// app/device-models/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="city"
      title="City"
      columns={[
        { 
          key: 'code', 
          label: 'code', 
          sortable: true,
       
        },
        { 
          key: 'name', 
          label: 'Name', 
          sortable: false 
        },
        { 
          key: 'Locode', 
          label: 'Locode Code', 
          sortable: false 
        },
        { 
          key: 'country', 
          label: 'Country', 
          sortable: true,
          render: (item) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const country = item.country as any;
            
            return (
              <div className="flex items-center gap-3">
                {/* صورة العلم */}
                {country?.imageUrl && (
                  <img 
                    src={country.imageUrl} 
                    alt={country.name || 'Country Flag'}
                    className="w-8 h-6 rounded object-cover border border-gray-200 shadow-sm"
                  />
                )}
                
                {/* اسم الدولة والكود */}
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {country?.name || 'N/A'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {country?.code && `Code: ${country.code}`}
                  </span>
                </div>
              </div>
            );
          }
        },
        { 
          key: 'port_types', 
          label: 'Port Types', 
          sortable: false,
          render: (item) => {
            const portTypes = item.port_types || [];
            
            if (portTypes.length === 0) {
              return (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <i className="fas fa-ban text-gray-400 text-xs"></i>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">No ports</span>
                  </div>
                </div>
              );
            }
            
            // أيقونات لكل نوع port
            const getPortIcon = (type: string) => {
              switch(type) {
                case 'Ocean': return '🌊';
                case 'Air': return '✈️';
                case 'Inland': return '🏞️';
                case 'Dry': return '🚂';
                case 'Fishing': return '🎣';
                default: return '📍';
              }
            };

            // ألوان لكل نوع port
            const getPortColor = (type: string) => {
              switch(type) {
                case 'Ocean': return 'from-blue-500 to-blue-600';
                case 'Air': return 'from-sky-500 to-sky-600';
                case 'Inland': return 'from-green-500 to-green-600';
                case 'Dry': return 'from-orange-500 to-orange-600';
                case 'Fishing': return 'from-purple-500 to-purple-600';
                default: return 'from-gray-500 to-gray-600';
              }
            };

            return (
              <div className="flex flex-wrap gap-2 justify-center">
                {portTypes.map((type: string, index: number) => (
                  <div
                    key={index}
                    className={`
                      relative group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                      bg-gradient-to-r ${getPortColor(type)} 
                      text-white text-xs font-medium 
                       hover:scale-105 hover:shadow-md
                    `}
                  >
                    {/* الأيقونة */}
                    <span className="text-sm">{getPortIcon(type)}</span>
                    
                    {/* النص */}
                    <span className="font-semibold">{type}</span>
                    
                    {/* تأثير hover */}
                    <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                ))}
              </div>
            );
          }
        },
       
      ]}
      
      // ✅ كل الموديلات شغالة
      showAddButton={true}
      showEditButton={true}
      showDeleteButton={true}
      showActiveToggle={true}
      showSearch={true}
      showFilter={true}
      showBulkActions={true}
      showDeletedToggle={true}
      
      // ✅ إضافة حقول الفورم
      formFields={[
           {
          name: "coed",
          label: "code ",
          type: "text" as const,
          required: true,
          placeholder: "Enter code "
        },
        {
          name: "name",
          label: "City Name",
          type: "text" as const,
          required: true,
          placeholder: "Enter city name"
        },
        {
          name: "Locode",
          label: "LOCODE",
          type: "text" as const,
          required: true,
          placeholder: "Enter LOCODE"
        },
        {
          name: "country_id",
          label: "Country",
          type: "select" as const,
          required: true,
          optionsKey: "countries"
        },
        {
          name: "port_types",
          label: "Port Types",
          type: "custom" as const,
          component: "checkbox-group",
          options: [
            { value: "Ocean", label: "🌊 Ocean Port" },
            { value: "Air", label: "✈️ Air Port" },
            { value: "Inland", label: "🏞️ Inland Port" },
          ]
        },
        {
          name: "active",
          label: "Active",
          type: "switch" as const
        }
      ]}
      
      // ✅ إضافة بيانات إضافية للبلدان
      additionalData={[
        {
          key: "countries",
          endpoint: "country"
        }
      ]}
      
      // ✅ فلترات إضافية
      availableFilters={[
        {
          key: "country_id",
          label: "Country",
          type: "select" as const,
          options: [
            { value: "1", label: "Afghanistan" },
            { value: "240", label: "Zimbabwe" }
          ]
        },
        {
          key: "active",
          label: "Active",
          type: "select" as const,
          options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" }
          ]
        }
      ]}
      
      // ✅ عدد العناصر في الصفحة
      initialPerPage={10}
    />
  );
}