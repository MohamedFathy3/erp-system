// components/FilterSearch/SearchBar.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  onSearch: () => void;
  onClearSearch?: () => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  search, 
  onSearchChange, 
  onSearch, 
  onClearSearch,
  placeholder = "Search in all fields...",
  className = ""
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleClear = (): void => {
    onSearchChange('');
    if (onClearSearch) {
      onClearSearch();
    } else {
      onSearch();
    }
  };

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <div className="relative flex-1 max-w-md">
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full text-black dark:text-gray-100 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:placeholder-gray-400 pr-10"
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <Button 
        onClick={onSearch} 
        className="bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl transition-all"
      >
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SearchBar;