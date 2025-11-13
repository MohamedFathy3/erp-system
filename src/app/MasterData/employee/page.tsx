'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";

export default function DeviceModelsPage() {
  return (
    <GenericDataManager
      endpoint="user"
      title="Users"
      columns={[
        { 
          key: 'code', 
          label: 'code', 
          sortable: true,
       
        },
       { 
  key: 'image', 
  label: 'Image', 
  sortable: false,
  render: (item) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isBlob = (image: any): image is Blob => {
      return image instanceof Blob;
    };

    return (
      <div className="flex justify-center">
        {item.image ? (
          <img 
            src={isBlob(item.image) ? URL.createObjectURL(item.image) : item.image as string} 
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200">
            <span className="text-gray-600 text-sm font-medium">
              {item.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
      </div>
    );
  }
},
        { key: 'name', label: 'Name', sortable: true },
        { key: 'position', label: 'Position', sortable: false },
        { key: 'phone', label: 'Phone', sortable: false },
        { key: 'email', label: 'Email', sortable: true },
    
        { key: 'role', label: 'Role', sortable: false },
        { 
          key: 'department', 
          label: 'Department', 
          sortable: false,
          render: (item) => item.department?.name || item.department || 'N/A'
        },
     
     
       
      ]}

      // APIs إضافية للـ dropdowns
      additionalData={[
        { key: 'department', endpoint: '/department' },
        { key: 'company', endpoint: '/company' },
        { key: 'branch', endpoint: '/branch' },
        { key: 'position', endpoint: '/position' },
        { key: 'city', endpoint: '/city' },
        { key: 'country', endpoint: '/country' }
      ]}

      // هنا بنمنع الفلترز خالص
      availableFilters={[]}
      
      formFields={[
              { 
          name: 'code', 
          label: 'code', 
          type: 'text', 
          required: true 
        },
        { 
          name: 'image', 
          label: 'Profile Picture', 
          type: 'file', 
          required: false 
        },
        { 
          name: 'name', 
          label: 'Name', 
          type: 'text', 
          required: true 
        },
        {
          name: "positionId",
          label: "Position",
          type: "select",
          optionsKey: "position",
          required: false
        },
        {
          name: "cityId",
          label: "City",
          type: "select",
          optionsKey: "city",
          required: false
        },
        {
          name: "countryId",
          label: "Country",
          type: "select",
          optionsKey: "country",
          required: false
        },
        { 
          name: 'phone', 
          label: 'Phone', 
          type: 'text', 
          required: false 
        },
        { 
          name: 'phoneExt', 
          label: 'Phone Extension', 
          type: 'text', 
          required: false 
        },
        { 
          name: 'cell', 
          label: 'Cell Phone', 
          type: 'text', 
          required: false 
        },
        { 
          name: 'email', 
          label: 'Email', 
          type: 'email', 
          required: true 
        },
       
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            { value: 'employee', label: 'Employee' },
            { value: 'admin', label: 'Admin' },
            { value: 'manager', label: 'Manager' }
          ],
          required: true
        },
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          optionsKey: "department",
          required: false
        },
        
        {
          name: "companyId",
          label: "Company",
          type: "select",
          optionsKey: "company",
          required: false
        },
        {
          name: "branchId",
          label: "Branch",
          type: "select",
          optionsKey: "branch",
          required: false
        }
      ]}
      initialData={{ role: 'employee' }}
      defaultFilters={{ role: 'employee' }}
    />
  );
}