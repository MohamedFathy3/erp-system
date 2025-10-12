// components/GenericDataManager.tsx
"use client";

import React from 'react';
import MainLayout from "@/components/MainLayout";
import Pagination from "@/components/Tablecomponents/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Filter, ArrowUpDown, Image, Mail, MapPin, Phone, Globe, Building, 
  Users, Briefcase, Shield, Circle, User, Smartphone, Landmark
} from "lucide-react";import { useGenericDataManager } from "@/hook/useGenericDataManager";
import FilterSearch from "@/components/Tablecomponents/FilterSearch/FilterSearch";
import { ImageUpload } from "@/components/Tablecomponents/ImageUpload";
import { Switch } from "@/components/Tablecomponents/Switch";
import { 
  GenericDataManagerProps, 
  CheckboxProps,
  HeaderProps,
  DataTableProps,
  FormModalProps,
  FormFieldProps,
  ColumnDefinition,
  Entity,
  SelectOption,
  PaginationMeta,
  FilterField
} from "@/types/generic-data-manager";

interface ExtendedHeaderProps extends HeaderProps {
  showFilter: boolean;
  searchTerm?: string;
}

const defaultPagination: PaginationMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 7,
  total: 0,
  links: []
};

export default function GenericDataManager(props: GenericDataManagerProps): React.ReactElement {
  const {
    // State
    search, setSearch,
    open, setOpen,
    editingItem, setEditingItem,
    currentPage, setCurrentPage,
    showFilter, setShowFilter,
    showingDeleted, setShowingDeleted,
    filters, setFilters,
    orderBy, setOrderBy,
    orderByDirection, setOrderByDirection,
    selectedItems, setSelectedItems,
    formData, setFormData,
    
    // Data
    data,
    pagination,
    isLoading,
    additionalQueries,
    
    // Actions
    handleSave,
    handleDelete,
    handleBulkDelete,
    handleBulkRestore,
    handleFilter,
    handleResetFilters,
    handleSearch,
    handleClearSearch,
    toggleSelectAll,
    toggleSelectItem,
    handleRestore, 
    handleForceDelete, 
    handleToggleActive,
    // Mutations
    saveItemMutation,
    deleteItemMutation,
    bulkDeleteMutation,
    bulkRestoreMutation,
  } = useGenericDataManager(props);

  const { 
    title, 
    columns, 
    formFields = [],
    availableFilters = [],
    additionalData = [],
    onToggleActive
  } = props;

  // استخدام pagination آمن مع قيمة افتراضية
  const safePagination: PaginationMeta = pagination || defaultPagination;

  // دالة لتوليد الفلاتر ديناميكياً
// دالة لتوليد الفلاتر ديناميكياً
const generateDynamicFilters = (): FilterField[] => {
  const dynamicFilters: FilterField[] = [];
  const addedFilters = new Set<string>();

  // فلتر البحث الأساسي - الاسم
  if (!addedFilters.has('name')) {
    dynamicFilters.push({
      key: 'name',
      label: 'Name',
      type: 'text' as const,
      placeholder: 'Search by name'
    });
    addedFilters.add('name');
  }

  // إضافة فلاتر من الـ columns (بدون الصورة والحقول المكررة)
  columns.forEach(column => {
    // نتجنب بعض الحقول
    const excludedKeys = [
      'id', 'actions', 'created_at', 'updated_at', 'deleted_at', 
      'image', 'avatar', 'photo','Logo' // نشيل حقول الصور
    ];
    
    if (!excludedKeys.includes(column.key) && 
        !addedFilters.has(column.key) &&
        column.key !== 'name') {
      
      // إذا الحقل موجود في additionalData أو له render function
      if (column.render || column.key.includes('Id') || column.key.endsWith('Id')) {
        const fieldName = column.key.replace('Id', '');
        if (!addedFilters.has(fieldName)) {
          dynamicFilters.push({
            key: column.key,
            label: column.label,
            type: 'select' as const,
            options: getOptionsForField(column.key)
          });
          addedFilters.add(column.key);
        }
      } else {
        // الحقول النصية العادية
        dynamicFilters.push({
          key: column.key,
          label: column.label,
          type: 'text' as const,
          placeholder: `Filter by ${column.label.toLowerCase()}`
        });
        addedFilters.add(column.key);
      }
    }
  });

  // إضافة فلاتر من الـ additionalData (بدون تكرار)
  additionalData?.forEach(data => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryData = additionalQueries[data.key]?.data as any[];
    if (Array.isArray(queryData) && queryData.length > 0) {
      const fieldName = data.key.replace('s', 'Id'); // تحويل 'brands' لـ 'brandId'
      const label = data.key.charAt(0).toUpperCase() + data.key.slice(1, -1); // 'brands' لـ 'Brand'
      
      // نتأكد إن الحقل مش موجود بالفعل
      if (!addedFilters.has(fieldName)) {
        dynamicFilters.push({
          key: fieldName,
          label: label,
          type: 'select' as const,
          options: queryData.map(item => ({
            value: item.id.toString(),
            label: item.name || item.title || `Item ${item.id}`
          }))
        });
        addedFilters.add(fieldName);
      }
    }
  });

  return dynamicFilters;
};
  // دالة مساعدة للحصول على options للحقول
  const getOptionsForField = (fieldKey: string): { value: string; label: string }[] => {
    const additionalDataKey = fieldKey.replace('Id', 's'); 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryData = additionalQueries[additionalDataKey]?.data as any[];
    
    if (Array.isArray(queryData)) {
      return queryData.map(item => ({
        value: item.id.toString(),
        label: item.name || item.title || `Item ${item.id}`
      }));
    }

    const defaultOptions: Record<string, { value: string; label: string }[]> = {
      status: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
      ],
      type: [
        { value: 'physical', label: 'Physical' },
        { value: 'digital', label: 'Digital' },
        { value: 'service', label: 'Service' }
      ]
    };

    return defaultOptions[fieldKey] || [];
  };

  const finalAvailableFilters: FilterField[] = availableFilters.length > 0 
    ? availableFilters 
    : generateDynamicFilters();

  // Checkbox Component
  const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, indeterminate, className }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      ref={(el) => {
        if (el) {
          el.indeterminate = indeterminate || false;
        }
      }}
      className={className || "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"}
    />
  );

  const allSelected: boolean = data.length > 0 && data.every(item => selectedItems.has(item.id));
  const someSelected: boolean = data.some(item => selectedItems.has(item.id));

  const handleToggleFilter = (): void => {
    setShowFilter((prev: boolean) => !prev);
  };

  const handleToggleDeleted = (): void => {
    setShowingDeleted((prev: boolean) => !prev);
  };

  const handleAddItem = (): void => {
    setEditingItem(null);
    setFormData({});
    setOpen(true);
  };

  const handleEditItem = (item: Entity): void => {
    setEditingItem(item);
    setFormData(item);
    setOpen(true);
  };

  const handleSort = (column: ColumnDefinition): void => {
    if (column.sortable !== false) {
      if (orderBy === column.key) {
        setOrderByDirection(orderByDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setOrderBy(column.key);
        setOrderByDirection('asc');
      }
    }
  };

  const handleFiltersChange = (newFilters: Record<string, string>): void => {
    setFilters(newFilters);
  };

  const handleOrderByChange = (newOrderBy: string): void => {
    setOrderBy(newOrderBy);
  };

  const handleOrderByDirectionChange = (newDirection: 'asc' | 'desc'): void => {
    setOrderByDirection(newDirection);
  };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormDataChange = (newFormData: Record<string, any>): void => {
    setFormData(newFormData);
  };

  const handleCloseModal = (): void => {
    setOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleItemToggleActive = (id: number, itemName: string, currentActive: boolean): void => {
    if (handleToggleActive) {
      handleToggleActive(id, itemName, currentActive);
    } else if (onToggleActive) {
      onToggleActive(id, itemName, currentActive);
    }
  };

  const hasManyFields = formFields.length > 5;
  
  // تحديد إذا كان هناك حقول صور في البيانات لعرض التصميم المدمج
  const hasImageColumn = columns.some(col => 
    ['image', 'avatar', 'photo', 'picture', 'profile_image', 'logo'].includes(col.key)
  );
  
  // تحديد إذا كان هناك الحقول المطلوبة للعرض المدمج
  const hasRequiredCompactFields = columns.some(col => 
    ['name', 'company', 'email', 'phone'].includes(col.key)
  );

  // تفعيل العرض المدمج إذا كان هناك صورة والحقول المطلوبة
  const shouldUseCompactView = hasImageColumn && hasRequiredCompactFields;

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <Header 
          title={title}
          currentPage={currentPage}
          pagination={safePagination}
          selectedItems={selectedItems}
          showingDeleted={showingDeleted}
          showFilter={showFilter}
          searchTerm={filters.search}
          onBulkAction={showingDeleted ? handleBulkRestore : handleBulkDelete}
          onToggleFilter={handleToggleFilter}
          onToggleDeleted={handleToggleDeleted}
          onAddItem={handleAddItem}
          bulkLoading={bulkDeleteMutation.isPending || bulkRestoreMutation.isPending}
        />

        {/* Search & Filter Component */}
        <FilterSearch
          search={search}
          onSearchChange={setSearch}
          onSearch={handleSearch}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          orderBy={orderBy}
          onOrderByChange={handleOrderByChange}
          orderByDirection={orderByDirection}
          onOrderByDirectionChange={handleOrderByDirectionChange}
          onApplyFilter={handleFilter}
          onResetFilters={handleResetFilters}
          showFilter={showFilter}
          onToggleFilter={handleToggleFilter}
          availableFilters={finalAvailableFilters}
        />

        {/* Table */}
     <DataTable
          title={title}
          data={data}
          columns={columns}
          selectedItems={selectedItems}
          allSelected={allSelected}
          someSelected={someSelected}
          orderBy={orderBy}
          orderByDirection={orderByDirection}
          pagination={safePagination}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectItem={toggleSelectItem}
          onSort={handleSort}
          onEdit={handleEditItem}
          onDelete={handleDelete}
          onToggleActive={handleItemToggleActive}
          deleteLoading={deleteItemMutation.isPending}
          Checkbox={Checkbox}
          showingDeleted={showingDeleted}
          onRestore={handleRestore} 
          onForceDelete={handleForceDelete}
          compactView={shouldUseCompactView}
        />

        {/* Pagination */}
        <Pagination
          currentPage={safePagination.current_page}
          lastPage={safePagination.last_page}
          total={safePagination.total}
          perPage={safePagination.per_page}
          onPageChange={setCurrentPage}
        />

        {/* Modal */}
        {open && (
          <FormModal
            title={title}
            editingItem={editingItem}
            formFields={formFields}
            formData={formData}
            additionalQueries={additionalQueries}
            onFormDataChange={handleFormDataChange}
            onSave={handleSave}
            onClose={handleCloseModal}
            saveLoading={saveItemMutation.isPending}
            compactLayout={hasManyFields}
          />
        )}
      </div>
    </MainLayout>
  );
}

// Sub-components
const Header: React.FC<ExtendedHeaderProps> = ({ 
  title, currentPage, pagination, selectedItems, showingDeleted, showFilter, searchTerm,
  onBulkAction, onToggleFilter, onToggleDeleted, onAddItem, bulkLoading 
}) => {
  const startItem = ((currentPage - 1) * pagination.per_page) + 1;
  const endItem = Math.min(currentPage * pagination.per_page, pagination.total);
  const totalItems = pagination.total;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Showing {startItem} to {endItem} of {totalItems} entries
       {searchTerm && (
  <span className="text-blue-600 dark:text-blue-400 ml-2">
    • Searching for: &quot;{searchTerm}&quot;
  </span>
)}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {selectedItems.size > 0 && (
          <Button
            variant="destructive"
            onClick={onBulkAction}
            className="bg-red-600 text-white hover:bg-red-700 transition-all"
            disabled={bulkLoading}
          >
            {showingDeleted ? `Restore Selected (${selectedItems.size})` : `Delete Selected (${selectedItems.size})`}
          </Button>
        )}

        <Button 
          onClick={onToggleDeleted} 
          className={showingDeleted ? "bg-red-400 text-white dark:bg-gray-600" : "bg-red-400 text-white"}
        >
          {showingDeleted ? 'Back to Active Items' : 'Show Deleted Items'}
        </Button>

        <Button
          className="bg-green-400 text-white hover:bg-green-700 transition-all dark:bg-green-500"
          onClick={onAddItem}
        >
          + Add {title}
        </Button>
      </div>
    </div>
  );
};

const DataTable: React.FC<DataTableProps & { 
  showingDeleted?: boolean;
  onRestore?: (id: number, itemName: string) => void;
  onForceDelete?: (id: number, itemName: string) => void;
  compactView?: boolean;
}> = ({
  title, data, columns, selectedItems, allSelected, someSelected,
  orderBy, orderByDirection, pagination, onToggleSelectAll, onToggleSelectItem,
  onSort, onEdit, onDelete, onRestore, onForceDelete, onToggleActive, deleteLoading, Checkbox, 
  showingDeleted = false,
  compactView = false
}) => {
  
  // تحديد إذا كان هناك أي عمود صورة
  const imageFieldKeys = ['image', 'avatar', 'photo', 'picture', 'profile_image', 'logo'];
  const hasImageColumn = columns.some(col => imageFieldKeys.includes(col.key));
  
  // الحقول التي تظهر في العرض المدمج (فقط هذه)
  const compactDisplayFields = ['name', 'company', 'email', 'phone'];
  
  // الحقول التي تظهر في الجدول العادي (كل ما عدا اللي فوق)
  const tableDisplayFields = ['position', 'cell', 'role', 'department', 'city', 'country'];

  // الحصول على مفتاح الصورة الفعلي المستخدم في البيانات
  const getImageFieldKey = (item: Entity) => {
    return imageFieldKeys.find(key => item[key]) || 'image';
  };

  // الحصول على الصورة من العنصر
  const getItemImage = (item: Entity) => {
    const imageKey = getImageFieldKey(item);
    const imageValue = item[imageKey];
    
    if (!imageValue) return null;
    
    if (typeof imageValue === 'string') {
      return imageValue;
    }
    
    if (typeof imageValue === 'object' && imageValue.url) {
      return imageValue.url;
    }
    
    return null;
  };

  // الحصول على بيانات العرض المدمج من العنصر (فقط الحقول المطلوبة)
  const getCompactDisplayData = (item: Entity) => {
    const displayData = [];

    // الاسم (دائماً يظهر)
    if (item.name || item.title) {
      displayData.push({
        field: 'name',
        value: item.name || item.title,
        isTitle: true
      });
    }

    // الشركة (إذا كان object)
    if (item.company?.name) {
      displayData.push({
        field: 'company',
        value: item.company.name,
        icon: 'building',
        type: 'text'
      });
    } else if (item.company) {
      displayData.push({
        field: 'company',
        value: item.company,
        icon: 'building',
        type: 'text'
      });
    }

    // الإيميل
    if (item.email) {
      displayData.push({
        field: 'email',
        value: item.email,
        icon: 'mail',
        type: 'email'
      });
    }

    // الهاتف الأرضي
    if (item.phone) {
      displayData.push({
        field: 'phone',
        value: item.phone,
        icon: 'phone',
        type: 'phone'
      });
    }

    return displayData;
  };

  // الحصول على الحرف الأول للصورة البديلة
  const getInitial = (item: Entity) => {
    const name = item.name || item.title || 'Unknown';
    return name.charAt(0).toUpperCase();
  };

  // الحصول على الأعمدة للعرض في الجدول (كل الحقول ما عدا المدمجة)
  const getTableColumns = () => {
    if (!compactView) return columns;
    
    return columns.filter(col => 
      ![...imageFieldKeys, ...compactDisplayFields].includes(col.key)
    );
  };

  // دالة للحصول على القيمة من الحقول المتداخلة
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  // مكون الأيقونة
  const IconComponent = ({ icon, className }: { icon: string; className?: string }) => {
    const iconProps = { className: className || "w-3 h-3 flex-shrink-0" };
    
    switch (icon) {
      case 'mail': return <Mail {...iconProps} />;
      case 'phone': return <Phone {...iconProps} />;
      case 'smartphone': return <Smartphone {...iconProps} />;
      case 'map-pin': return <MapPin {...iconProps} />;
      case 'building': return <Building {...iconProps} />;
      case 'users': return <Users {...iconProps} />;
      case 'briefcase': return <Briefcase {...iconProps} />;
      case 'globe': return <Globe {...iconProps} />;
      case 'shield': return <Shield {...iconProps} />;
      case 'landmark': return <Landmark {...iconProps} />;
      case 'user': return <User {...iconProps} />;
      default: return <Circle {...iconProps} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
      <div className={`${showingDeleted ? 'bg-red-100 dark:bg-red-800 text-red-400 dark:text-red-100' : 'bg-blue-100 dark:bg-blue-800 text-blue-400 dark:text-blue-100'} font-semibold text-lg px-6 py-4 rounded-t-2xl dark:border-blue-900`}>
        {title} Management {showingDeleted && '(Deleted Items)'}
      </div>
   
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {data.length} of {pagination.total} items
            {showingDeleted && <span className="text-red-500 ml-1">(Deleted)</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sorted by:</span>
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {orderBy} ({orderByDirection})
          </span>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={onToggleSelectAll}
                className="h-4 w-4"
              />
            </th>
            {compactView && hasImageColumn ? (
              <>
                {/* عمود البيانات المدمجة */}
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
                  Basic Info
                </th>
                {/* الأعمدة العادية للباقي */}
                {getTableColumns().map((column: ColumnDefinition) => (
                  <th key={column.key} className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
                    <div 
                      className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600"
                      onClick={() => onSort(column)}
                    >
                      {column.label}
                      {column.sortable !== false && <ArrowUpDown className="w-4 h-4" />}
                    </div>
                  </th>
                ))}
              </>
            ) : (
              // العرض العادي بدون دمج
              columns.map((column: ColumnDefinition) => (
                <th key={column.key} className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
                  <div 
                    className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600"
                    onClick={() => onSort(column)}
                  >
                    {column.label}
                    {column.sortable !== false && <ArrowUpDown className="w-4 h-4" />}
                  </div>
                </th>
              ))
            )}
            <th className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white text-center dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
          {data.length ? (
            data.map((item: Entity) => {
              const itemImage = getItemImage(item);
              const compactData = getCompactDisplayData(item);
              const shouldUseCompactView = compactView && hasImageColumn;
              const itemName = item.name || item.title || 'Unknown';

              return (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onChange={() => onToggleSelectItem(item.id)}
                      className="h-4 w-4"
                    />
                  </td>
                  
                  {shouldUseCompactView ? (
                    <>
                      {/* الخلية المدمجة - فقط: صورة + اسم + شركة + ايميل + هاتف */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          {/* الصورة - مستطيلة */}
                          <div className="flex-shrink-0">
                            {itemImage ? (
                              <img 
                                src={itemImage}
                                alt={itemName}
                                className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                <span className="text-white font-bold text-xl">
                                  {getInitial(item)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* البيانات الأساسية فقط */}
                          <div className="flex-1 text-left min-w-0">
                            <div className="space-y-2">
                              {compactData.map((data, index) => (
                                <div key={index}>
                                  {data.isTitle ? (
                                    <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                                      {data.value}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                      <IconComponent icon={data.icon || 'default-icon'} />

                                      <span className="truncate">{data.value}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* باقي الأعمدة في الجدول عادي */}
                      {getTableColumns().map((column: ColumnDefinition) => (
                        <td key={column.key} className="px-6 py-4 text-gray-700 dark:text-gray-300">
                          {column.render ? column.render(item) : getNestedValue(item, column.key)}
                        </td>
                      ))}
                    </>
                  ) : (
                    // العرض العادي بدون دمج
                    columns.map((column: ColumnDefinition) => (
                      <td key={column.key} className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {column.render ? column.render(item) : getNestedValue(item, column.key)}
                      </td>
                    ))
                  )}
                  
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-2">
                      {showingDeleted ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRestore?.(item.id, itemName)}
                            className="bg-green-600 text-white hover:bg-green-700 border-0"
                          >
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onForceDelete?.(item.id, itemName)}
                            className="bg-red-800 text-white hover:bg-red-900 border-0"
                          >
                            Delete Permanently
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {/* زر التبديل للنشاط إذا كان موجوداً */}
                          {item.hasOwnProperty('active') && (
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={!!item.active}
                                onChange={() => onToggleActive?.(item.id, itemName, !!item.active)}
                              />
                              <span className={`text-sm font-medium ${item.active ? 'text-green-600' : 'text-red-600'}`}>
                                {item.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(item.id, itemName)}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length + 2} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No {title.toLowerCase()} found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};



const FormModal: React.FC<FormModalProps & { compactLayout?: boolean }> = ({
  title, editingItem, formFields, formData, additionalQueries,
  onFormDataChange, onSave, onClose, saveLoading,
  compactLayout = false
}) => {
  // تجميع الحقول في صفوف إذا كان هناك أكثر من 5 حقول
  const groupedFields = compactLayout 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? formFields.reduce((groups: any[][], field, index) => {
        const groupIndex = Math.floor(index / 2);
        if (!groups[groupIndex]) groups[groupIndex] = [];
        groups[groupIndex].push(field);
        return groups;
      }, [])
    : [formFields];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl ${compactLayout ? 'w-full max-w-4xl' : 'w-full max-w-md'} p-6 relative max-h-[90vh] overflow-y-auto`}>
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold z-10"
        >
          ✖
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          {editingItem ? `Edit ${title}` : `Add ${title}`}
        </h2>
        <form className="space-y-4" onSubmit={onSave}>
          {groupedFields.map((fieldGroup, groupIndex) => (
            <div 
              key={groupIndex} 
              className={`grid gap-4 ${compactLayout ? 'grid-cols-2' : 'grid-cols-1'}`}
            >
              {fieldGroup.map((field) => (
                <FormFieldComponent
                  key={field.name}
                  field={field}
                  value={formData[field.name] || ""}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(value: any) => onFormDataChange({ ...formData, [field.name]: value })}
                  additionalQueries={additionalQueries}
                  formData={formData}
                  compact={compactLayout}
                />
              ))}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all rounded-xl mt-6"
            disabled={saveLoading}
          >
            {saveLoading ? "Saving..." : editingItem ? "Update" : "Create"}
          </Button>
        </form>
      </div>
    </div>
  );
};

const FormFieldComponent: React.FC<FormFieldProps & { compact?: boolean }> = ({ 
  field, value, onChange, additionalQueries, formData = {}, compact = false 
}) => {
  // أنواع الحقول التي تعتبر صور
  const imageFieldTypes = ['image', 'avatar', 'photo', 'picture', 'profile_image', 'logo'];
  
  if (imageFieldTypes.includes(field.type)) {
    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : ''}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
        </label>
        <ImageUpload
          onImageChange={(file) => onChange(file)}
          currentImage={typeof value === 'string' ? value : value?.url}
          multiple={field.multiple}
          accept={field.accept}
        />
      </div>
    );
  }

  // معالجة حقل التبديل
  if (field.type === "switch") {
    return (
      <div className={`flex items-center justify-between ${compact ? '' : 'col-span-2'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
        </label>
        <Switch
          checked={!!value}
          onChange={onChange}
        />
      </div>
    );
  }

  // معالجة حقل النص الطويل
  if (field.type === "textarea") {
    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : ''}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
        </label>
        <textarea
          name={field.name}
          value={value?.toString() || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          required={field.required}
          rows={field.rows || 4}
          className="w-full p-3 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
          placeholder={field.placeholder}
        />
      </div>
    );
  }

  // معالجة حقل التحديد
  if (field.type === "select") {
    let options: SelectOption[] = [];

    if (field.optionsKey && additionalQueries) {
const queryData = (additionalQueries as Record<string, { data?: unknown[] }>)?.[field.optionsKey]?.data;
      options = Array.isArray(queryData)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? queryData.map((opt: any) => ({
            value: opt.id,
            label: opt.name || opt.title || `Item ${opt.id}`,
          }))
        : [];
    } else if (field.options) {
      options = field.options;
    }

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
        </label>
        <select
          name={field.name}
          value={value?.toString() || ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          className="w-full p-3 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required={field.required}
        >
          <option value="">Select {field.label}</option>
          {options.map((option: SelectOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // معالجة حقل الملف (غير الصورة)
  if (field.type === "file") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
        </label>
        <Input
          name={field.name}
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;
            onChange(file);
          }}
          required={field.required}
          className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
          accept={field.accept}
        />
      </div>
    );
  }

  // معالجة باقي أنواع الحقول
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.label}
      </label>
      <Input
        name={field.name}
        type={field.type}
        placeholder={field.placeholder || field.label}
        value={value?.toString() || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={field.required}
        className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
      />
    </div>
  );
};