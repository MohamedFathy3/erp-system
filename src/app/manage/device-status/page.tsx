"use client";

import { useState, useEffect, FormEvent } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Category {
  id: number;
  name: string;
 
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface ApiResponse {
  data: Category[];
  meta: PaginationMeta;
}

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  className?: string;
}

export default function Page() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    links: []
  });

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  async function fetchCategories(page = 1) {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/device-status?page=${page}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const json: ApiResponse = await res.json();
      setData(json.data || []);
      setPagination(json.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData = {
      name: formData.get("name") as string,
      type: formData.get("type") as string
    };

    try {
      if (editingCategory) {
        // Update existing category - PATCH to /device-status/{id}
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/device-status/${editingCategory.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        });
        
        if (!res.ok) {
          throw new Error("Failed to update cadevice-statustegory");
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/device-status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        });
        
        if (!res.ok) {
          throw new Error("Failed to create category");
        }
      }
      
      // Refresh data and close modal
      fetchCategories(currentPage);
      setOpen(false);
      setEditingCategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this device-status?")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/device-status/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [id] }),
        });
        
        if (!res.ok) {
          throw new Error("Failed to delete device-status");
        }
        
        fetchCategories(currentPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedItems.size} device-status?`)) {
      try {
        const ids = Array.from(selectedItems);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/device-status/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });
        
        if (!res.ok) {
          throw new Error("Failed to delete device-status");
        }
        
        setSelectedItems(new Set());
        fetchCategories(currentPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  const toggleSelectAll = () => {
    const pageIds = filteredData.map(item => item.id);
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

  // مكون Checkbox البديل إذا لم يكن لديك مكون UI جاهز
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

  if (loading && data.length === 0) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </MainLayout>
    );
  }

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = filteredData.length > 0 && filteredData.every(item => selectedItems.has(item.id));
  const someSelected = filteredData.some(item => selectedItems.has(item.id));

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Device Status</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Showing {((currentPage - 1) * pagination.per_page) + 1} to {Math.min(currentPage * pagination.per_page, pagination.total)} of {pagination.total} entries
            </p>
          </div>
          <div className="flex gap-2">
            {selectedItems.size > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                Delete Selected ({selectedItems.size})
              </Button>
            )}
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
              onClick={() => {
                setEditingCategory(null);
                setOpen(true);
              }}
            >
              + Add device-status
            </Button>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Search device-status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md text-black dark:text-gray-100 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:placeholder-gray-400"
        />

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
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
                {["ID", "Name", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
              {filteredData.length ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{item.id}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.name}</td>
                   
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(item);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No device-status found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.current_page} of {pagination.last_page}
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
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 relative transform scale-95 animate-fadeIn">
              <button
                onClick={() => {
                  setOpen(false);
                  setEditingCategory(null);
                }}
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold"
              >
                ✖
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                {editingCategory ? "Edit device-status" : "Add device-status"}
              </h2>
              <form className="space-y-4" onSubmit={handleSave}>
                <Input
                  name="name"
                  placeholder="Device Status Name"
                  defaultValue={editingCategory?.name || ""}
                  required
                  className="rounded-xl dark:bg-gray-800 dark:text-gray-100"
                />
               
                <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all rounded-xl">
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}