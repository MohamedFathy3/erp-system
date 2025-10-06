// components/GenericDataManager.tsx
"use client";

import React from 'react';
import MainLayout from "@/components/MainLayout";
import Pagination from "@/components/Tablecomponents/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, ArrowUpDown } from "lucide-react";
import { useGenericDataManager } from "@/hook/useGenericDataManager";
import FilterSearch from "@/components/Tablecomponents/FilterSearch/FilterSearch";
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
    // Mutations
    saveItemMutation,
    deleteItemMutation,
    bulkDeleteMutation,
    bulkRestoreMutation,
  } = useGenericDataManager(props); // ← تمرير كل الـ props

  const { 
    title, 
    columns, 
    formFields = [],
    availableFilters = [],
    additionalData = []
  } = props;

  // استخدام pagination آمن مع قيمة افتراضية
  const safePagination: PaginationMeta = pagination || defaultPagination;

  // دالة لتوليد الفلاتر ديناميكياً
  const generateDynamicFilters = (): FilterField[] => {
    const dynamicFilters: FilterField[] = [];

    // فلتر البحث الأساسي
    dynamicFilters.push({
      key: 'name',
      label: 'Name',
      type: 'text' as const,
      placeholder: 'Search by name'
    });

    // إضافة فلاتر من الـ columns
    columns.forEach(column => {
      // نتجنب بعض الحقول
      const excludedKeys = ['id', 'actions', 'created_at', 'updated_at', 'deleted_at'];
      
      if (!excludedKeys.includes(column.key) && column.key !== 'name') {
        if (column.render || column.key.includes('.')) {
          const fieldName = column.key.replace('Id', ''); // إزالة Id إذا موجود
          dynamicFilters.push({
            key: column.key,
            label: column.label,
            type: 'select' as const,
            options: getOptionsForField(column.key)
          });
        } else {
          // حقول نصية عادية
          dynamicFilters.push({
            key: column.key,
            label: column.label,
            type: 'text' as const,
            placeholder: `Filter by ${column.label.toLowerCase()}`
          });
        }
      }
    });

    // إضافة فلاتر من الـ additionalData
    additionalData?.forEach(data => {
      const queryData = additionalQueries[data.key]?.data as any[];
      if (Array.isArray(queryData) && queryData.length > 0) {
        const fieldName = data.key.replace('s', 'Id'); // تحويل 'brands' لـ 'brandId'
        const label = data.key.charAt(0).toUpperCase() + data.key.slice(1, -1); // 'brands' لـ 'Brand'
        
        // نتأكد إن الحقل مش موجود بالفعل
        if (!dynamicFilters.some(filter => filter.key === fieldName)) {
          dynamicFilters.push({
            key: fieldName,
            label: label,
            type: 'select' as const,
            options: queryData.map(item => ({
              value: item.id.toString(),
              label: item.name || item.title || `Item ${item.id}`
            }))
          });
        }
      }
    });

    return dynamicFilters;
  };

  // دالة مساعدة للحصول على options للحقول
  const getOptionsForField = (fieldKey: string): { value: string; label: string }[] => {
    // إذا الحقل موجود في additionalData
    const additionalDataKey = fieldKey.replace('Id', 's'); 
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

  const handleFormDataChange = (newFormData: Record<string, string | number>): void => {
    setFormData(newFormData);
  };

  const handleCloseModal = (): void => {
    setOpen(false);
    setEditingItem(null);
    setFormData({});
  };

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
          deleteLoading={deleteItemMutation.isPending}
          Checkbox={Checkbox}
           showingDeleted={showingDeleted}
          onRestore={handleRestore} 
          onForceDelete={handleForceDelete}
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
          />
        )}
      </div>
    </MainLayout>
  );
}

// ... باقي الـ Sub-components (Header, DataTable, FormModal, FormFieldComponent) نفس الكود السابق
// Sub-components
const Header: React.FC<ExtendedHeaderProps> = ({ 
  title, currentPage, pagination, selectedItems, showingDeleted, showFilter, searchTerm,
  onBulkAction, onToggleFilter, onToggleDeleted, onAddItem, bulkLoading 
}) => {
  // حسابات آمنة للبيانات المعروضة
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
              • Searching for: "{searchTerm}"
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
          className="bg-green-400  text-white hover:bg-green-700 transition-all dark:bg-green-500"
          onClick={onAddItem}
        >
          + Add {title}
        </Button>
      </div>
    </div>
  );
};

// في components/GenericDataManager.tsx - تحديث DataTable component
const DataTable: React.FC<DataTableProps & { 
  showingDeleted?: boolean;
  onRestore?: (id: number, itemName: string) => void;
  onForceDelete?: (id: number, itemName: string) => void;
}> = ({
  title, data, columns, selectedItems, allSelected, someSelected,
  orderBy, orderByDirection, pagination, onToggleSelectAll, onToggleSelectItem,
  onSort, onEdit, onDelete, onRestore, onForceDelete, deleteLoading, Checkbox, 
  showingDeleted = false
}) => (
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
          {columns.map((column: ColumnDefinition) => (
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
          <th className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white text-center dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
        {data.length ? (
          data.map((item: Entity) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4">
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onChange={() => onToggleSelectItem(item.id)}
                  className="h-4 w-4"
                />
              </td>
              {columns.map((column: ColumnDefinition) => (
                <td key={column.key} className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
              <td className="px-6 py-4 flex justify-center gap-2">
                {showingDeleted ? (
                  // الأزرار في وضع العناصر المحذوفة
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore?.(item.id, item.title || item.name || 'item')}
                      className="bg-green-600 text-white hover:bg-green-700 border-0"
                    >
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onForceDelete?.(item.id, item.title || item.name || 'item')}
                      className="bg-red-800 text-white hover:bg-red-900 border-0"
                    >
                      Delete Permanently
                    </Button>
                  </div>
                ) : (
                  // الأزرار العادية في وضع العناصر النشطة
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(item.id, item.title || item.name || 'item')}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))
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

const FormModal: React.FC<FormModalProps> = ({
  title, editingItem, formFields, formData, additionalQueries,
  onFormDataChange, onSave, onClose, saveLoading 
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 relative">
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold"
      >
        ✖
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        {editingItem ? `Edit ${title}` : `Add ${title}`}
      </h2>
      <form className="space-y-4" onSubmit={onSave}>
        {formFields.map((field) => (
          <FormFieldComponent
            key={field.name}
            field={field}
            value={formData[field.name] || ""}
            onChange={(value: string) => onFormDataChange({ ...formData, [field.name]: value })}
            additionalQueries={additionalQueries}
          />
        ))}

        <Button
          type="submit"
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all rounded-xl"
          disabled={saveLoading}
        >
          {saveLoading ? "Saving..." : editingItem ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  </div>
);

const FormFieldComponent: React.FC<FormFieldProps> = ({ field, value, onChange, additionalQueries }) => {
  if (field.type === "select") {
    let options: SelectOption[] = [];

    if (field.optionsKey && additionalQueries) {
      const queryData = additionalQueries[field.optionsKey]?.data as unknown[] | undefined;
      options = Array.isArray(queryData)
        ? queryData.map((opt: any) => ({
            value: opt.id,
            label: opt.name,
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
          value={value.toString()}
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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.label}
      </label>
      <Input
        name={field.name}
        type={field.type}
        placeholder={field.label}
        value={value.toString()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={field.required}
        className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
      />
    </div>
  );
};