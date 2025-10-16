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
   showSearch = true,
  showFilterSection = true,
  availableFilters = []
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* <SearchBar 
          search={search}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          placeholder="Search by name..."
          className="flex-1"
        /> */}
        <div></div>
        
       <Button
  variant="default"
  onClick={onToggleFilter}
  className={`
    relative overflow-hidden bg-gradient-to-r
    from-orange-50 to-orange-100
    dark:from-orange-900/30 dark:to-orange-800/30
    hover:from-orange-100 hover:to-orange-200
    dark:hover:from-orange-800/40 dark:hover:to-orange-700/40
    text-orange-800 dark:text-orange-200 font-semibold
    py-3 px-6 rounded-2xl shadow-md hover:shadow-lg
    transform hover:-translate-y-0.5 active:translate-y-0
    transition-all duration-250 ease-in-out
    border border-orange-100 dark:border-orange-900/50 group
  `}
>
  <Filter className="w-4 h-4 mr-2 text-black" />

  <span className="flex items-center gap-3">
    {showFilter ? (
      <>
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
          <i className="fas fa-eye-slash text-yellow-600 dark:text-yellow-400 text-sm"></i>
        </div>
        <span className="text-yellow-700 dark:text-yellow-300">Hide Filters</span>
      </>
    ) : (
      <>
        <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
          <i className="fas fa-filter text-blue-500 dark:text-orange-400 text-sm"></i>
        </div>
        <span className="text-black dark:text-orange-300">Show Filters</span>
      </>
    )}
  </span>
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