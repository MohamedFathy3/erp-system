"use client";

import {  FormEvent } from "react";

export interface Category {
  id: number;
  name: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  className?: string;
}

interface CategoryTableProps {
  data: Category[];
  loading: boolean;
  error?: string | null;
  search: string;
  setSearch: (value: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pagination: PaginationMeta;
  selectedItems: Set<number>;
  toggleSelectItem: (id: number) => void;
  toggleSelectAll: () => void;
  handleDelete: (id: number) => void;
  handleBulkDelete: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  editingCategory: Category | null;
  setEditingCategory: (cat: Category | null) => void;
  handleSave: (e: FormEvent<HTMLFormElement>) => void;
}

export default function CategoryTable({
  data,
  loading,
  error,
  search,
  selectedItems,
}: CategoryTableProps) {
  const Checkbox = ({ checked, onChange, indeterminate, className }: CheckboxProps) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      ref={(el) => { if (el) el.indeterminate = indeterminate || false; }}
      className={className || "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"}
    />
  );

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = filteredData.length > 0 && filteredData.every(item => selectedItems.has(item.id));
  const someSelected = filteredData.some(item => selectedItems.has(item.id));

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8 p-6">
     
    </div>
  );
}
