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
} from "lucide-react";
import { useGenericDataManager } from "@/hook/useGenericDataManager";
import FilterSearch from "@/components/Tablecomponents/FilterSearch/FilterSearch";
import { ImageUpload } from "@/components/Tablecomponents/ImageUpload";
import { Switch } from "@/components/Tablecomponents/Switch";
import { 
  GenericDataManagerProps, 
  CheckboxProps,
  HeaderProps,
  DataTableProps,
  FormModalProps,
  ColumnDefinition,
  Entity,
  SelectOption,
  PaginationMeta,
  FilterField,
  SaveOptions,
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

// الدوال المساعدة المستقلة - برة الـ component
const isRelationField = (key: string): boolean => {
  const relationPatterns = ['_id$', 'Id$', '_by$', 'By$'];
  return relationPatterns.some(pattern => new RegExp(pattern).test(key));
};

const isBooleanField = (key: string): boolean => {
  const booleanFields = ['active', 'is_active', 'enabled', 'verified', 'status'];
  return booleanFields.includes(key);
};

const hasRelationData = (key: string, columns: ColumnDefinition[]): boolean => {
  const relationField = key.replace(/_id$/, '');
  return columns.some(col => col.key === relationField);
};

const getOptionsForRelationField = (
  fieldKey: string, 
  additionalQueries: Record<string, { data?: unknown[] }>,
  data: Entity[],
  columns: ColumnDefinition[]
): { value: string; label: string }[] => {
  let relationName: string;
  
  if (fieldKey.endsWith('_id')) {
    relationName = fieldKey.replace('_id', 's');
  } else {
    relationName = fieldKey + 's';
  }
  
  // جرب الـ additionalQueries أولاً
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let queryData = additionalQueries[relationName]?.data as any[];
  
  if (!Array.isArray(queryData) || queryData.length === 0) {
    const singularName = relationName.endsWith('s') ? relationName.slice(0, -1) : relationName;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryData = additionalQueries[singularName]?.data as any[];
  }
  
  if (Array.isArray(queryData) && queryData.length > 0) {
    return queryData.map(item => ({
      value: item.id.toString(),
      label: item.name || item.title || item.code || item.local_name || `Item ${item.id}`
    }));
  }

  // لو مفيش additional queries، استخرج من البيانات الموجودة
  const uniqueValues = new Set<string>();
  
  data.forEach(item => {
    // جرب الحقل العلائقي مباشرة (مثل company بدل company_id)
    const relationField = fieldKey.replace(/_id$/, '');
    const relationValue = item[relationField];
    
    if (relationValue) {
      if (typeof relationValue === 'object' && relationValue.name) {
        uniqueValues.add(relationValue.name);
      } else if (typeof relationValue === 'string') {
        uniqueValues.add(relationValue);
      }
    }
    
    // جرب الحقل الأصلي (مثل company_id)
    const originalValue = item[fieldKey];
    if (originalValue && typeof originalValue === 'string') {
      uniqueValues.add(originalValue);
    }
  });

  if (uniqueValues.size > 0) {
    return Array.from(uniqueValues).map(value => ({
      value: value.toLowerCase().replace(/\s+/g, '_'),
      label: value
    }));
  }

  return [];
};

// الدالة الرئيسية لإنشاء الفلاتر
const generateDynamicFilters = (
  columns: ColumnDefinition[],
  additionalQueries: Record<string, { data?: unknown[] }>,
  data: Entity[],
  additionalData: { key: string; endpoint: string }[] = []
): FilterField[] => {
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

  // إضافة فلاتر من الـ columns
  columns.forEach(column => {
    const excludedKeys = [
      'id', 'actions', 'created_at', 'updated_at', 'deleted_at', 
      'image', 'avatar', 'photo', 'logo', 'local_name', 'phone', 
      'code', 'Status', 'fax', 'address', 'zip_code', 'alias_name', 
      'notes', 'mobile', 'phone_two', 'email','flag','imageUrl'
    ];
    
    if (!excludedKeys.includes(column.key) && 
        !addedFilters.has(column.key) &&
        column.key !== 'name') {
      
      if (isRelationField(column.key) || hasRelationData(column.key, columns)) {
        const baseFieldName = column.key.replace(/_id$/, '');
        if (!addedFilters.has(baseFieldName)) {
          const options = getOptionsForRelationField(column.key, additionalQueries, data, columns);
          if (options.length > 0) {
            dynamicFilters.push({
              key: column.key,
              label: column.label,
              type: 'select' as const,
              options: options
            });
            addedFilters.add(column.key);
          }
        }
      } else if (isBooleanField(column.key)) {
        dynamicFilters.push({
          key: column.key,
          label: column.label,
          type: 'select' as const,
          options: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ]
        });
        addedFilters.add(column.key);
      } else {
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

  // إضافة فلاتر من الـ additionalData
  additionalData?.forEach(dataItem => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryData = additionalQueries[dataItem.key]?.data as any[];
    if (Array.isArray(queryData) && queryData.length > 0) {
      
      let fieldName: string;
      let label: string;
      
      if (dataItem.key.endsWith('s')) {
        fieldName = dataItem.key.replace('s', '_id');
        label = dataItem.key.charAt(0).toUpperCase() + dataItem.key.slice(1, -1);
      } else {
        fieldName = dataItem.key + '_id';
        label = dataItem.key.charAt(0).toUpperCase() + dataItem.key.slice(1);
      }
      
      if (!addedFilters.has(fieldName)) {
        dynamicFilters.push({
          key: fieldName,
          label: label,
          type: 'select' as const,
          options: queryData.map(item => ({
            value: item.id.toString(),
            label: item.name || item.title || item.code || `Item ${item.id}`
          }))
        });
        addedFilters.add(fieldName);
      }
    }
  });

  return dynamicFilters;
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
     handleDeleteAll,
    // Data
    data,
    pagination,
    isLoading,
    additionalQueries,
    perPage, setPerPage,
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
      handleForceDeleteSelected,

  } = useGenericDataManager(props);

  const { 
    title, 
    columns, 
    formFields = [],
    availableFilters = [],
    additionalData = [],
    onToggleActive,
   showAddButton = true,
    showEditButton = true,
    showDeleteButton = true,
    showActiveToggle = true,
    showSearch = true,
    showBulkActions = true,
    showDeletedToggle = true,
 
  } = props;

  // استخدام pagination آمن مع قيمة افتراضية
  const safePagination: PaginationMeta = pagination || defaultPagination;

  const finalAvailableFilters: FilterField[] = availableFilters.length > 0 
    ? availableFilters 
    : generateDynamicFilters(columns, additionalQueries, data, additionalData);

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
      <div className="space-y-6 p-6 pb-16 border-black rounded-lg min-h-screen">
        {/* Main Section - كل المكونات في سكشن واحد */}
     
          
          {/* Header داخل السكشن */}
          <Header 
            title={title}
            dataLength={data.length} 
            onDeleteAll={handleDeleteAll} 
            currentPage={currentPage}
            pagination={safePagination}
            selectedItems={selectedItems}
            showingDeleted={showingDeleted}
            showFilter={showFilter}
            onForceDeleteSelected={handleForceDeleteSelected}
            searchTerm={filters.search}
            onBulkAction={showingDeleted ? handleBulkRestore : handleBulkDelete}
            onToggleFilter={handleToggleFilter}
            onToggleDeleted={handleToggleDeleted}
            onAddItem={handleAddItem}
            bulkLoading={bulkDeleteMutation.isPending || bulkRestoreMutation.isPending}
            showEditButton={showEditButton}
            showDeleteButton={showDeleteButton}
            showActiveToggle={showActiveToggle}
            showAddButton={showAddButton}
            showBulkActions={showBulkActions}
            showDeletedToggle={showDeletedToggle}
          />

          {/* Search & Filter داخل السكشن */}
          {(showSearch || showFilter) && (
            <div className="mt-6">
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
            </div>
          )}

          {/* Table داخل السكشن */}
          <div className="mt-6">
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
              showEditButton={showEditButton}
              showDeleteButton={showDeleteButton}
              showActiveToggle={showActiveToggle}
              perPage={perPage} // تمرير
            onPerPageChange={setPerPage} 
            />
          </div>

          {/* Pagination داخل السكشن */}
          <div className="mt-6">
            <Pagination
              currentPage={safePagination.current_page}
              lastPage={safePagination.last_page}
              total={safePagination.total}
              perPage={perPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Modal خارج السكشن الرئيسي */}
        {(showAddButton || showEditButton) && open && (
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
    </MainLayout>
  );
}


// Sub-components
const Header: React.FC<ExtendedHeaderProps & { 
  onDeleteAll?: () => void; 
  dataLength: number;
  showAddButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showActiveToggle?: boolean;
  showBulkActions?: boolean;
  showDeletedToggle?: boolean;
}> = ({ 
  title, currentPage, pagination, selectedItems, showingDeleted, showFilter, searchTerm,
  onBulkAction, onToggleFilter, onToggleDeleted, onAddItem, onDeleteAll, dataLength,
  bulkLoading,  
  showAddButton = true,
  showEditButton = true,
  showDeleteButton = true,
  showActiveToggle = true,
  showBulkActions = true,
  showDeletedToggle = true,
  onForceDeleteSelected,
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
     
      <div className="flex gap-3 flex-wrap">
        {/* Bulk Action Button - يظهر فقط لما يتم تحديد عناصر */}
        {selectedItems.size > 0 && showDeleteButton && showBulkActions && (
          <Button
            variant="destructive"
            onClick={onBulkAction}
            style={{color:'black'}}
            className={`
              relative
              overflow-hidden
              bg-gradient-to-r
              from-red-50
              to-red-100
              dark:from-red-900/30
              dark:to-red-800/30
              hover:from-red-100
              hover:to-red-200
              dark:hover:from-red-800/40
              dark:hover:to-red-700/40
              text-black
              dark:text-red-200
              font-semibold
              py-3
              px-6
              rounded-2xl
              shadow-md
              hover:shadow-lg
              transform
              hover:-translate-y-0.5
              active:translate-y-0
              transition-all
              duration-250
              ease-in-out
              border
              border-red-100
              dark:border-red-900/50
              group
              ${bulkLoading ? 'opacity-70 cursor-wait' : ''}
            `}
            disabled={bulkLoading}
          >
            <span className="relative z-10 flex items-center gap-3">
              {bulkLoading ? (
                <i className="fas fa-spinner fa-spin text-sm"></i>
              ) : showingDeleted ? (
                <i className="fas fa-rotate-left group-hover:rotate-180 transition-transform duration-500"></i>
              ) : (
                <i className="fas fa-trash group-hover:scale-110 transition-transform duration-200"></i>
              )}
              {showingDeleted ? `Restore Selected (${selectedItems.size})` : `Delete Selected (${selectedItems.size})`}
            </span>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Button>
        )}

        {/* Force Delete Button */}
        {showingDeleted && selectedItems.size > 0 && (
          <Button
            style={{color:"#b91c1c"}}
            variant="destructive"
            onClick={onForceDeleteSelected}
            className={`
              bg-gradient-to-r from-red-50 to-red-100 dark:bg-red-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200
            `}
          >
            <span className="relative z-10 flex items-center gap-3">
              <i className="fas fa-fire text-red-600 group-hover:scale-110 transition-transform duration-200"></i>
              Force Delete Selected ({selectedItems.size})
            </span>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Button>
        )}

        {/* Toggle Deleted Button */}
        {showDeletedToggle && (
          <Button 
            onClick={onToggleDeleted} 
            className={`
              relative
              overflow-hidden
              bg-gradient-to-r
              from-red-50
              to-red-100
              dark:from-red-900/30
              dark:to-red-800/30
              hover:from-red-100
              hover:to-red-200
              dark:hover:from-red-800/40
              dark:hover:to-red-700/40
              text-black
              dark:text-red-200
              font-semibold
              py-3
              px-6
              rounded-2xl
              shadow-md
              hover:shadow-lg
              transform
              hover:-translate-y-0.5
              active:translate-y-0
              transition-all
              duration-250
              ease-in-out
              border
              border-red-100
              dark:border-red-900/50
              group
            `}
          >
            <span className="flex items-center gap-3">
              {showingDeleted ? (
                <>
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <i className="fas fa-arrow-left text-red-600 dark:text-red-400 text-sm"></i>
                  </div>
                  <span className="text-red-700 dark:text-red-300">Back to Active Items</span>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 dark:bg-red-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <i className="fas fa-trash-can text-red-600 dark:text-red-400 text-sm"></i>
                  </div>
                  <span className="text-black dark:text-red-300">Show Deleted Items</span>
                </>
              )}
            </span>
          </Button>
        )}

        {/* Add Button */}
        {showAddButton && !showingDeleted && (
          <Button
            className={`
              relative overflow-hidden bg-gradient-to-r from-green-50 to-green-100
              dark:from-green-900/30 dark:to-green-800/30 hover:from-green-100 hover:to-green-200
              dark:hover:from-green-800/40 dark:hover:to-green-700/40 text-black dark:text-green-200
              font-semibold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5
              active:translate-y-0 transition-all duration-250 ease-in-out border border-green-100 dark:border-green-900/50 group
            `}
            onClick={onAddItem}
          >
            <span className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <i className="fas fa-plus text-green-600 dark:text-green-400 text-sm"></i>
              </div>
              <span className="text-black dark:text-green-300">Add {title}</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Button>
        )}
      </div>
    </div>
  );
};

const DataTable: React.FC<DataTableProps & { 
  showingDeleted?: boolean;
  onRestore?: (id: number, itemName: string) => void;
  onForceDelete?: (id: number, itemName: string) => void;
  compactView?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showActiveToggle?: boolean;
  prePage?: number;
  onPerPageChange?: (perPage: number) => void;
}> = ({
  title, data, columns, selectedItems, allSelected, someSelected,
  orderBy, orderByDirection, pagination, onToggleSelectAll, onToggleSelectItem,
  onSort, onEdit, onDelete, onRestore, onForceDelete, onToggleActive, deleteLoading, Checkbox, 
  showingDeleted = false,
  compactView = false,  
  showEditButton = true,
  showDeleteButton = true,
  showActiveToggle = true,
   perPage = 5,
  onPerPageChange,
}) => {
  
  // تحديد إذا كان هناك أي عمود صورة
  const imageFieldKeys = ['image', 'avatar', 'photo', 'picture', 'profile_image', 'logo'];
  const hasImageColumn = columns.some(col => imageFieldKeys.includes(col.key));
  
  // الحقول التي تظهر في العرض المدمج (فقط هذه)
  const compactDisplayFields = ['name', 'company', 'email', 'phone'];
  
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

  // دالة للتعامل مع الضغط المزدوج
  const handleDoubleClick = (item: Entity) => {
    onEdit(item);
  };

  return (
    <div className="w-full">
      {/* Container ثابت للجدول */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* Table Header */}
       <div className={`${
          showingDeleted
          ? "bg-red-100 dark:bg-red-800 text-red-400 dark:text-red-100 border-b border-red-200 dark:border-red-700"
          : "bg-gradient-to-r from-green-200 to-green-300 dark:from-green-900/30 dark:to-green-800/30 text-black dark:text-green-200 border-b border-green-100 dark:border-green-900/50"
        } font-semibold text-lg px-6 py-4`}>
          {title} Management {showingDeleted && "(Deleted Items)"}
        </div>

        {/* Table Info Bar */}
        <div className={`p-4 flex items-center justify-between ${
          showingDeleted ? "bg-red-50 dark:bg-red-900/20" : "bg-white dark:bg-gray-800"
        }`}>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${
              showingDeleted ? "text-red-600 dark:text-red-300" : "text-gray-600 dark:text-gray-400"
            }`}>
              Showing {data.length} of {pagination.total} items
              {showingDeleted && (
                <span className="text-red-500 ml-1">(Deleted)</span>
              )}
            </span>
            
            {/* Dropdown لتحديد عدد العناصر المعروضة - تم التحديث */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
              <select 
                value={perPage}
                onChange={(e) => onPerPageChange?.(Number(e.target.value))}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              showingDeleted ? "text-red-600 dark:text-red-300" : "text-gray-600 dark:text-gray-400"
            }`}>
              Sorted by:
            </span>
            <span className={`text-sm font-medium ${
              showingDeleted ? "text-red-700 dark:text-red-400" : "text-indigo-600 dark:text-indigo-400"
            }`}>
              {orderBy} ({orderByDirection})
            </span>
          </div>
        </div>

        

        {/* Table Container مع ارتفاع ثابت */}
        <div className="overflow-hidden">
          <div className="max-h-[500px] overflow-auto"> {/* ارتفاع ثابت مع اسكرول داخلي */}
            <table className={`w-full divide-y ${
              showingDeleted
              ? "divide-red-300 dark:divide-red-700"
              : "divide-gray-200 dark:divide-gray-700"
            }`}>
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-center w-12">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={onToggleSelectAll}
                      className="h-4 w-4"
                    />
                  </th>
                  {compactView && hasImageColumn ? (
                    <>
                      {/* Compact Data Column */}
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider min-w-[300px]">
                        Basic Info
                      </th>
                      {/* Regular Columns */}
                      {getTableColumns().map((column: ColumnDefinition) => (
                        <th key={column.key} className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider min-w-[120px]">
                          <div 
                            className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                            onClick={() => onSort(column)}
                          >
                            {column.label}
                            {column.sortable !== false && <ArrowUpDown className="w-4 h-4" />}
                          </div>
                        </th>
                      ))}
                    </>
                  ) : (
                    // Normal View
                    columns.map((column: ColumnDefinition) => (
                      <th key={column.key} className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider min-w-[120px]">
                        <div 
                          className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                          onClick={() => onSort(column)}
                        >
                          {column.label}
                          {column.sortable !== false && <ArrowUpDown className="w-4 h-4" />}
                        </div>
                      </th>
                    ))
                  )}
                  {/* إخفاء عمود الإجراءات إذا لم يكن هناك أي أزرار مسموح بها */}
                  {(showEditButton || showDeleteButton || showActiveToggle) && (
                    <th className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider min-w-[180px]">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.length ? (
                  data.map((item: Entity) => {
                    const itemImage = getItemImage(item);
                    const compactData = getCompactDisplayData(item);
                    const shouldUseCompactView = compactView && hasImageColumn;
                    const itemName = item.name || item.title || 'Unknown';

                    return (
                      <tr 
                        key={item.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                        onDoubleClick={() => showEditButton && handleDoubleClick(item)}
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onChange={() => onToggleSelectItem(item.id)}
                            className="h-4 w-4"
                          />
                        </td>
                        
                        {shouldUseCompactView ? (
                          <>
                            {/* Compact Cell */}
                            <td className="px-4 py-3">
                              <div className="flex items-start gap-3">
                                {/* Image */}
                                <div className="flex-shrink-0">
                                  {itemImage ? (
                                    <img 
                                      src={itemImage}
                                      alt={itemName}
                                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600 shadow-sm"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm">
                                      <span className="text-white font-bold text-lg">
                                        {getInitial(item)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Basic Data */}
                                <div className="flex-1 text-left min-w-0">
                                  <div className="space-y-1">
                                    {compactData.map((data, index) => (
                                      <div key={index}>
                                        {data.isTitle ? (
                                          <div className="font-bold text-gray-900 dark:text-gray-100 text-base">
                                            {data.value}
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
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
                            
                            {/* Other Columns */}
                            {getTableColumns().map((column: ColumnDefinition) => (
                              <td 
                                key={column.key} 
                                className="px-4 py-3 text-gray-700 dark:text-gray-300 text-sm"
                                onDoubleClick={() => showEditButton && handleDoubleClick(item)}
                              >
                                {column.render ? column.render(item) : getNestedValue(item, column.key)}
                              </td>
                            ))}
                          </>
                        ) : (
                          // Normal View
                          columns.map((column: ColumnDefinition) => (
                            <td 
                              key={column.key} 
                              className="px-4 py-3 text-gray-700 dark:text-gray-300 text-sm"
                              onDoubleClick={() => showEditButton && handleDoubleClick(item)}
                            >
                              {column.render ? column.render(item) : getNestedValue(item, column.key)}
                            </td>
                          ))
                        )}
                        
                        {/* إخفاء خلية الإجراءات إذا لم يكن هناك أي أزرار مسموح بها */}
                        {(showEditButton || showDeleteButton || showActiveToggle) && (
                          <td className="px-4 py-3">
                            <div className="flex justify-center items-center gap-2">
                              {showingDeleted ? (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onRestore?.(item.id, itemName)}
                                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 text-xs"
                                  >
                                    <i className="fas fa-rotate-left mr-1"></i>
                                    Restore
                                  </Button>
                                  {/* زر الحذف الدائم - يظهر فقط إذا كان مسموحاً بالحذف */}
                                  {showDeleteButton && (
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => onForceDelete?.(item.id, itemName)}
                                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 text-xs"
                                    >
                                      <i className="fas fa-trash mr-1"></i>
                                      Delete
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  {/* Active Toggle - يظهر فقط إذا كان مسموحاً به */}
                                  {item.hasOwnProperty('active') && showActiveToggle && (
                                    <div className="flex items-center gap-1">
                                      <Switch
                                        checked={!!item.active}
                                        onChange={() => onToggleActive?.(item.id, itemName, !!item.active)}
                                      />
                                      <span className={`text-xs font-medium ${item.active ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.active ? 'Active' : 'Inactive'}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {/* زر التعديل - يظهر فقط إذا كان مسموحاً به */}
                                  {showEditButton && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => onEdit(item)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs"
                                    >
                                      <i className="fas fa-edit mr-1"></i>
                                      Edit
                                    </Button>
                                  )}
                                  
                                  {/* زر الحذف - يظهر فقط إذا كان مسموحاً به */}
                                  {showDeleteButton && (
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => onDelete(item.id, itemName)}
                                      disabled={deleteLoading}
                                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 text-xs"
                                    >
                                      {deleteLoading ? (
                                        <>
                                          <i className="fas fa-spinner fa-spin mr-1"></i>
                                          Deleting...
                                        </>
                                      ) : (
                                        <>
                                          <i className="fas fa-trash mr-1"></i>
                                          Delete
                                        </>
                                      )}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td 
                      colSpan={
                        columns.length + 
                        (compactView && hasImageColumn ? 2 : 1) + 
                        ((showEditButton || showDeleteButton || showActiveToggle) ? 1 : 0)
                      } 
                      className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center justify-center py-8">
                        <i className="fas fa-inbox text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                        <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
                          No {title.toLowerCase()} found
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          {showingDeleted ? 'No deleted items available' : 'Get started by adding a new item'}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
<div className="flex space-x-4 mt-6">
  <Button
    style={{color:'black'}}
    type="submit"
    className="w-full bg-gradient-to-r from-green-50 to-green-100 text-black hover:bg-indigo-700 transition-all rounded-xl"
    disabled={saveLoading}
  >
    {saveLoading ? "Saving..." : editingItem ? "Save" : "Save"}
  </Button>

  <Button
    style={{color:'black'}}
    type="button"
    className="w-full bg-gradient-to-r from-green-50 to-green-100 text-black hover:bg-green-200 transition-all rounded-xl"
    disabled={saveLoading}
    onClick={() => {
      const saveOptions: SaveOptions = { keepOpen: true };
      onSave(saveOptions);
    }}
  >
    {saveLoading ? "Saving..." : editingItem ? "Save & new" : "Save & new"}
  </Button>

  {/* زر Close */}
  <Button
    type="button"
    style={{background:"#fee4e4",color:'black'}}
    className="w-full bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gray-200 transition-all rounded-xl border-none"
    onClick={onClose}
    disabled={saveLoading}
  >
    Close
  </Button>
</div>

        </form>
      </div>
    </div>
  );
};



import { SelectField } from "./SelectField";

interface FormFieldProps {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (val: any) => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalQueries?: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData?: any;
  compact?: boolean;
}

export const FormFieldComponent: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  additionalQueries,
  formData = {},
  compact = false,
}) => {
  const imageFieldTypes = [
    "image",
    "avatar",
    "photo",
    "picture",
    "profile_image",
    "logo",
  ];

  // ✅ معالجة حقل التحديد (select)
  if (field.type === "select") {
    return (
      <SelectField
        field={field}
        value={value}
        onChange={onChange}
        additionalQueries={additionalQueries}
      />
    );
  }

  // ✅ معالجة الصور
  if (imageFieldTypes.includes(field.type)) {
    return (
      <div className={`space-y-2 ${compact ? "col-span-2" : ""}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
        </label>
        <ImageUpload
          onImageChange={(file) => onChange(file)}
          currentImage={typeof value === "string" ? value : value?.url}
          multiple={field.multiple}
          accept={field.accept}
        />
      </div>
    );
  }

  // ✅ معالجة الـ Switch
  if (field.type === "switch") {
    return (
      <div
        className={`flex items-center justify-between ${
          compact ? "" : "col-span-2"
        }`}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
        </label>
        <Switch checked={!!value} onChange={onChange} />
      </div>
    );
  }

  // في FormFieldComponent - أضف هذا الشرط بعد الـ switch مباشرة
if (field.type === "custom-time") {
  const timeValue = value || '00:00:00';
  const [rawHours = '00', minutes = '00', seconds = '00'] = timeValue.split(':');

  // احسب الأيام من الساعات لو الساعات فوق 24
  const totalHours = parseInt(rawHours);
  const days = Math.floor(totalHours / 24);
  const hours = (totalHours % 24).toString().padStart(2, '0');

  const handleChange = (newDays: string, newHours: string, newMinutes: string, newSeconds: string) => {
    const totalHours = (parseInt(newDays) * 24 + parseInt(newHours)).toString().padStart(2, '0');
    const finalTime = `${totalHours}:${newMinutes}:${newSeconds}`;
    onChange(finalTime);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="grid grid-cols-4 gap-3">
        {/* Days */}
        <div>
          <label className="block text-xs text-gray-500 mb-1 text-center">Days</label>
          <select
            value={days.toString()}
            onChange={(e) => handleChange(e.target.value, hours, minutes, seconds)}
            className="w-full p-3 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 text-center"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i.toString()}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Hours */}
        <div>
          <label className="block text-xs text-gray-500 mb-1 text-center">Hours</label>
          <select
            value={hours}
            onChange={(e) => handleChange(days.toString(), e.target.value, minutes, seconds)}
            className="w-full p-3 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 text-center"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i.toString().padStart(2, '0')}>
                {i.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Minutes */}
        <div>
          <label className="block text-xs text-gray-500 mb-1 text-center">Minutes</label>
          <select
            value={minutes}
            onChange={(e) => handleChange(days.toString(), hours, e.target.value, seconds)}
            className="w-full p-3 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 text-center"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i.toString().padStart(2, '0')}>
                {i.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Seconds */}
      
      </div>

      {/* عرض الوقت النهائي */}
      <div className="text-center mt-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
          Selected:{" "}
          <span className="font-mono font-bold">
            {String(days)} day(s), {hours}:{minutes}
          </span>
        </span>
      </div>
    </div>
  );
}

  // ✅ textarea
  if (field.type === "textarea") {
    return (
      <div className={`space-y-2 ${compact ? "col-span-2" : ""}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
        </label>
        <textarea
          name={field.name}
          value={value?.toString() || ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={field.rows || 4}
          className="w-full p-3 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
          placeholder={field.placeholder}
        />
      </div>
    );
  }

  // ✅ file input
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

  // ✅ باقي الحقول العادية
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        name={field.name}
        type={field.type}
        placeholder={field.placeholder || field.label}
        value={value?.toString() || ""}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
      />
    </div>
  );
};

