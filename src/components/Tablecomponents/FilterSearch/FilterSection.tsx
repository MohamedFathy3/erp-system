// components/FilterSearch/FilterSection.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { FilterField } from '@/types/generic-data-manager';

interface FilterSectionProps {
  filters: Record<string, string>;
  onFiltersChange: (filters: Record<string, string>) => void;
  orderBy: string;
  onOrderByChange: (orderBy: string) => void;
  orderByDirection: 'asc' | 'desc';
  onOrderByDirectionChange: (direction: 'asc' | 'desc') => void;
  onApplyFilter: () => void;
  onResetFilters: () => void;
  availableFilters?: FilterField[];
  className?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFiltersChange,
  orderBy,
  onOrderByChange,
  orderByDirection,
  onOrderByDirectionChange,
  onApplyFilter,
  onResetFilters,
  availableFilters = [],
  className = ""
}) => {
  // إذا availableFilters فاضي، ما نعرضش أي فلترز
  const filterFields = availableFilters.length > 0 ? availableFilters : [];

  const handleFilterChange = (key: string, value: string): void => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onOrderByChange(e.target.value);
  };

  const handleOrderByDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onOrderByDirectionChange(e.target.value as 'asc' | 'desc');
  };

  const renderFilterField = (field: FilterField): React.ReactNode => {
    switch (field.type) {
      case 'select':
        return (
          <select
            value={filters[field.key] || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleFilterChange(field.key, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="">All {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={filters[field.key] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleFilterChange(field.key, e.target.value)
            }
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={filters[field.key] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleFilterChange(field.key, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        );

      default: // text
        return (
          <Input
            type="text"
            value={filters[field.key] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleFilterChange(field.key, e.target.value)
            }
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        );
    }
  };

  return (
    <div className={`w-full bg-gray-100 dark:bg-gray-700 p-6 rounded-md space-y-6 ${className}`}>
      {/* حقول الفلترة الديناميكية - تظهر فقط إذا كان في فلترز */}
      {filterFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>
              {renderFilterField(field)}
            </div>
          ))}
        </div>
      )}

      {/* خيارات الترتيب */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Order By
          </label>
          <select
            value={orderBy}
            onChange={handleOrderByChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="created_at">Created Date</option>
            <option value="updated_at">Updated Date</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Order Direction
          </label>
          <select
            value={orderByDirection}
            onChange={handleOrderByDirectionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="asc">Ascending (A-Z)</option>
            <option value="desc">Descending (Z-A)</option>
          </select>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="flex flex-col md:flex-row gap-4 pt-4">
        <Button
          variant="default"
          onClick={onApplyFilter}
          className="w-full text-white transition-all rounded-md px-5 h-12 text-lg flex items-center justify-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Filter className="w-5 h-5" />
          Apply Filters
        </Button>

        <Button
          onClick={onResetFilters}
          className="w-full bg-gray-500 text-white hover:bg-gray-600 transition-all rounded-md px-5 h-12 text-lg flex items-center justify-center gap-2 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          <Filter className="w-5 h-5" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;