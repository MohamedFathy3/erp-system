// components/FilterSearch/FilterSearch.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import SearchBar from './SearchBar';
import FilterSection from './FilterSection';
import { FilterSearchProps } from '@/types/generic-data-manager';

const FilterSearch: React.FC<FilterSearchProps> = ({
  search,
  onSearchChange,
  onSearch,
  filters,
  onFiltersChange,
  orderBy,
  onOrderByChange,
  orderByDirection,
  onOrderByDirectionChange,
  onApplyFilter,
  onResetFilters,
  showFilter,
  onToggleFilter,
  availableFilters = []
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar 
          search={search}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          placeholder="Search by name..."
          className="flex-1"
        />
        
        <Button
          variant="default"
          onClick={onToggleFilter}
          className="bg-purple-400  text-white hover:bg-purple-700 transition-all dark:bg-indigo-500"
        >
          <Filter className="w-4 h-4 mr-2" 
/>
          {showFilter ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* قسم الفلترة */}
      {showFilter && (
        <FilterSection
          filters={filters}
          onFiltersChange={onFiltersChange}
          orderBy={orderBy}
          onOrderByChange={onOrderByChange}
          orderByDirection={orderByDirection}
          onOrderByDirectionChange={onOrderByDirectionChange}
          onApplyFilter={onApplyFilter}
          onResetFilters={onResetFilters}
          availableFilters={availableFilters}
        />
      )}
    </div>
  );
};

export default FilterSearch;