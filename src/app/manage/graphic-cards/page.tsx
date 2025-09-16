"use client";

import { useState, useEffect, FormEvent, MouseEvent } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, ArrowUpDown } from "lucide-react";
import toast from 'react-hot-toast';

export interface Memory {
  id: number;
  model: string;
  vram: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface ApiResponse {
  data: Memory[];
  meta: PaginationMeta;
}

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  className?: string;
}

interface FilterPayload {
  filters: {
    model?: string;
    vram?: string;
  };
  orderBy: string;
  orderByDirection: string;
  perPage: number;
  page: number;
  paginate: boolean;
  deleted?: boolean;
}

export default function Page() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [perPage] = useState(15);
  const [showingDeleted, setShowingDeleted] = useState(false);
  
  const [filters, setFilters] = useState({
    model: '',
    vram: ''
  });
  const [orderBy, setOrderBy] = useState('id');
  const [orderByDirection, setOrderByDirection] = useState('desc');
  
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const { data: memoryData, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['graphic-card', currentPage, showingDeleted, filters, orderBy, orderByDirection],
    queryFn: async () => {
      const payload: FilterPayload = {
        filters: {
        },
        orderBy,
        orderByDirection,
        perPage,
        page: currentPage,
        paginate: true,
        ...(showingDeleted && { deleted: true })
      };

      if (filters.model) {
        payload.filters.model = filters.model;
      }
      if (filters.vram) {
        payload.filters.vram = filters.vram;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphic-card/index`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch type');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 60 * 1000,
  });

  const data = memoryData?.data || [];
  const pagination = memoryData?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    links: []
  };

  const saveMemoryMutation = useMutation({
    mutationFn: async (memoryData: Memory) => {
      let url;
      let method;

      if (memoryData.id) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/graphic-card/${memoryData.id}`;
        method = "PATCH";
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/graphic-card`;
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memoryData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save graphic-card");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graphic-card'] });
      toast.success(editingMemory ? 'graphic card updated successfully!' : 'graphic card created successfully!');
      setOpen(false);
      setEditingMemory(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const deleteMemoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphic-card/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Items: [id] }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete graphic-card");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graphic-card'] });
      toast.success('Deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphic-card/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Items: ids }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete graphic-card");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graphic-card'] });
      setSelectedItems(new Set());
      toast.success('Deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphic-card/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Items: ids }),
      });

      if (!response.ok) {
        throw new Error("Error restoring items");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graphic-card'] });
      setSelectedItems(new Set());
      toast.success('Items restored successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleSave = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const form = (e.target as HTMLElement).closest("form");
    if (!form) return;

    const formData = new FormData(form);
    const memoryData = {
      ...(editingMemory && { id: editingMemory.id }),
      model: formData.get("model") as string,
      vram: formData.get("vram") as string,
    };

    saveMemoryMutation.mutate(memoryData as Memory);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this graphic card?")) {
      deleteMemoryMutation.mutate(id);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedItems.size} type item(s)?`)) {
      const ids = Array.from(selectedItems);
      bulkDeleteMutation.mutate(ids);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedItems.size === 0) return;

    if (confirm(`Are you sure you want to restore ${selectedItems.size} item(s)?`)) {
      const ids = Array.from(selectedItems);
      bulkRestoreMutation.mutate(ids);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    setShowFilter(false);
    toast.success('Filter applied successfully!');
  };

  const handleResetFilters = () => {
    setFilters({
      model: '',
      vram: ''
    });
    setOrderBy('id');
    setOrderByDirection('desc');
    setCurrentPage(1);
    setShowFilter(false);
    toast.success('Filters reset successfully!');
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, model: search }));
    setCurrentPage(1);
  };

  const toggleSelectAll = () => {
    const pageIds = data.map(item => item.id);
    const allSelected = pageIds.every(id => selectedItems.has(id));
    
    if (allSelected) {
      const newSet = new Set(selectedItems);
      pageIds.forEach(id => newSet.delete(id));
      setSelectedItems(newSet);
    } else {
      const newSet = new Set(selectedItems);
      pageIds.forEach(id => newSet.add(id));
      setSelectedItems(newSet);
    }
  };

  const toggleSelectItem = (id: number) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  const Checkbox = ({ checked, onChange, indeterminate, className }: CheckboxProps) => (
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

 
  const allSelected = data.length > 0 && data.every(item => selectedItems.has(item.id));
  const someSelected = data.some(item => selectedItems.has(item.id));

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Graphic Cards</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {selectedItems.size > 0 && (
              <Button
                variant="destructive"
                onClick={showingDeleted ? handleBulkRestore : handleBulkDelete}
                className="bg-red-600 text-white hover:bg-red-700 transition-all"
                disabled={bulkDeleteMutation.isPending || bulkRestoreMutation.isPending}
              >
                {showingDeleted ? `Restore Selected (${selectedItems.size})` : `Delete Selected (${selectedItems.size})`}
              </Button>
            )}

            <Button
            variant="default"
              className=" text-white  transition-all dark:bg-blue-500 dark:hover:bg-blue-500 rounded-xl"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilter ? 'Hide Filters' : 'Show Filters'}
            </Button>

            <div className="flex gap-4">
              <Button 
                onClick={() => setShowingDeleted(!showingDeleted)} 
                className={showingDeleted ? "bg-gray-500 text-white dark:bg-gray-600" : "bg-red-600 text-white"}
              >
                {showingDeleted ? 'Back to Active Items' : 'Show Deleted Items'}
              </Button>
            </div>

            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all dark:bg-indigo-500"
              onClick={() => {
                setEditingMemory(null);
                setOpen(true);
              }}
            >
              + Add graphic-card
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search by graphic-card..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="max-w-md text-black dark:text-gray-100 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:placeholder-gray-400"
          />
          <Button onClick={handleSearch} className="bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        
        {showFilter && (
          <div className="w-full bg-gray-100 dark:bg-gray-700 p-6 rounded-md space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  model
                </label>
                <Input
                  type="text"
                  value={filters.model}
                  onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Filter by model"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
              </div>
              
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Order By
                </label>
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  <option value="id">ID</option>
                  <option value="model">Model</option>
                  <option value="varm">varm</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Order Direction
                </label>
                <select
                  value={orderByDirection}
                  onChange={(e) => setOrderByDirection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  <option value="asc">Ascending (A-Z)</option>
                  <option value="desc">Descending (Z-A)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Button
              variant="default"
                onClick={handleFilter}
                className="w-full  text-white transition-all rounded-md px-5 h-12 text-lg flex items-center justify-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <Filter className="w-5 h-5" />
                Apply Filters
              </Button>

              <Button
                onClick={handleResetFilters}
                className="w-full bg-gray-500 text-white hover:bg-gray-600 transition-all rounded-md px-5 h-12 text-lg flex items-center justify-center gap-2 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <Filter className="w-5 h-5" />
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
          <div className="bg-blue-100 dark:bg-blue-800 text-blue-400 dark:text-blue-100 font-semibold text-lg px-6 py-4 rounded-t-2xl  dark:border-blue-900">
   
  </div>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {data.length} of {pagination.total} items
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
                    onChange={toggleSelectAll}
                    className="h-4 w-4"
                  />
                </th>
                {["ID", "model", "varm", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600"
                      onClick={() => {
                        const field = header.toLowerCase();
                        if (orderBy === field) {
                          setOrderByDirection(orderByDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setOrderBy(field);
                          setOrderByDirection('asc');
                        }
                      }}
                    >
                      {header}
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white text-center dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
              {data.length ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{item.id}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.model}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.vram}</td>
                 
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingMemory(item);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMemoryMutation.isPending}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No memory items found {Object.values(filters).some(f => f) ? 'matching your filters' : ''}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.current_page} of {pagination.last_page} • Total: {pagination.total} items
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
              let pageNum;
              if (pagination.last_page <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.last_page - 2) {
                pageNum = pagination.last_page - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? "bg-indigo-600 text-white" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === pagination.last_page}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === pagination.last_page}
              onClick={() => setCurrentPage(pagination.last_page)}
            >
              Last
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Go to page:</span>
            <Input
              type="number"
              min="1"
              max={pagination.last_page}
              defaultValue={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= pagination.last_page) {
                  setCurrentPage(page);
                }
              }}
              className="w-20 text-black dark:text-gray-100 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800"
            />
          </div>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 relative">
              <button 
                onClick={() => { setOpen(false); setEditingMemory(null); }} 
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold"
              >
                ✖
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                {editingMemory ? "Edit Memory" : "Add Memory"}
              </h2>
              <form className="space-y-4" onSubmit={handleSave}>
                <Input 
                  name="model" 
                  placeholder="Memory model" 
                  defaultValue={editingMemory?.model || ""} 
                  required 
                  className="rounded-xl dark:bg-gray-800 dark:text-gray-100" 
                />
                <Input
                  name="vram"
                  placeholder="Memory vram"
                  defaultValue={editingMemory?.vram || ""}
                  required
                  className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
                />

                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all rounded-xl"
                  disabled={saveMemoryMutation.isPending}
                >
                  {saveMemoryMutation.isPending ? "Saving..." : (editingMemory ? "Update" : "Create")}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}