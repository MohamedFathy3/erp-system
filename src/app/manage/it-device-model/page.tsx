"use client";

import { useState, useEffect, FormEvent } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Brand {
  id: number;
  name: string;
}

export interface Processor {
  id: number;
  name: string;
  brandId: number;
  brand: Brand;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface ApiResponse {
  data: Processor[];
  meta: PaginationMeta;
}

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  className?: string;
}

export default function Page() {
  const [data, setData] = useState<Processor[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingProcessor, setEditingProcessor] = useState<Processor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    links: []
  });
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  useEffect(() => {
    fetchProcessors(currentPage);
    fetchBrands();
  }, [currentPage]);

  async function fetchProcessors(page = 1) {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/device-model?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch processors");
      const json: ApiResponse = await res.json();
      setData(json.data || []);
      setPagination(json.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

async function fetchBrands() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brand`);
    if (!res.ok) throw new Error("Failed to fetch brands");
    const json = await res.json();
    setBrands(Array.isArray(json.data) ? json.data : []);
  } catch (err) {
    console.error(err);
    setBrands([]);
  }
}

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBrandId) return alert("Please select a brand");

    const formData = new FormData(e.currentTarget);
    const processorData = {
      name: formData.get("name") as string,
      brandId: selectedBrandId
    };

    try {
      if (editingProcessor) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/device-model/${editingProcessor.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(processorData),
        });
        if (!res.ok) throw new Error("Failed to update device model");
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/i/device-mode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(processorData),
        });
        if (!res.ok) throw new Error("Failed to create device model");
      }
      fetchProcessors(currentPage);
      setOpen(false);
      setEditingProcessor(null);
      setSelectedBrandId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this device model?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/i/device-mode/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!res.ok) throw new Error("Failed to delete device model");
      fetchProcessors(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedItems.size} device model?`)) return;

    try {
      const ids = Array.from(selectedItems);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/i/device-mode/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Failed to delete device model");
      setSelectedItems(new Set());
      fetchProcessors(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const toggleSelectAll = () => {
    const pageIds = filteredData.map(item => item.id);
    const allSelected = pageIds.every(id => selectedItems.has(id));
    const newSet = new Set(selectedItems);
    if (allSelected) pageIds.forEach(id => newSet.delete(id));
    else pageIds.forEach(id => newSet.add(id));
    setSelectedItems(newSet);
  };

  const toggleSelectItem = (id: number) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItems(newSet);
  };

  const Checkbox = ({ checked, onChange, indeterminate, className }: CheckboxProps) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      ref={(el) => { if (el) el.indeterminate = indeterminate || false; }}
      className={className || "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"}
    />
  );

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.brand.name.toLowerCase().includes(search.toLowerCase())
  );
  const allSelected = filteredData.length > 0 && filteredData.every(item => selectedItems.has(item.id));
  const someSelected = filteredData.some(item => selectedItems.has(item.id));

  if (loading && data.length === 0)
    return <MainLayout><div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div></MainLayout>;

  if (error)
    return <MainLayout><div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Device model</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Showing {((currentPage - 1) * pagination.per_page) + 1} to {Math.min(currentPage * pagination.per_page, pagination.total)} of {pagination.total} entries
            </p>
          </div>
          <div className="flex gap-2">
            {selectedItems.size > 0 && <Button variant="destructive" onClick={handleBulkDelete}>Delete Selected ({selectedItems.size})</Button>}
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all" onClick={() => { setEditingProcessor(null); setOpen(true); setSelectedBrandId(null); }}>+ Add device model</Button>
          </div>
        </div>

        {/* Search */}
        <Input placeholder="Search device model..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-md rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:placeholder-gray-400" />

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Checkbox checked={allSelected} indeterminate={someSelected && !allSelected} onChange={toggleSelectAll} />
                </th>
                {["ID","Name","Brand","Actions"].map(header => <th key={header} className="px-6 py-3 text-center font-medium uppercase tracking-wider">{header}</th>)}
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredData.length ? filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4"><Checkbox checked={selectedItems.has(item.id)} onChange={() => toggleSelectItem(item.id)} /></td>
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.brand.name}</td>
                  <td className="px-6 py-4 flex gap-2 justify-center  ">
                    <Button variant="outline" size="sm" onClick={() => { setEditingProcessor(item); setOpen(true); setSelectedBrandId(item.brand.id); }}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </td>
                </tr>
              )) : <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No device model found</td></tr>}
            </tbody>
          </table>
          
        </div>
{/* Pagination */}
{pagination.total > pagination.per_page && (
  <div className="flex justify-center mt-4 space-x-2">
    {/* Previous */}
    <Button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      Previous
    </Button>

    {/* Pages */}
    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
      <Button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 rounded ${
          page === currentPage ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700"
        } hover:bg-indigo-500 hover:text-white transition-colors`}
      >
        {page}
      </Button>
    ))}

    {/* Next */}
    <Button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))}
      disabled={currentPage === pagination.last_page}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      Next
    </Button>
  </div>
)}

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 relative">
              <button onClick={() => { setOpen(false); setEditingProcessor(null); setSelectedBrandId(null); }} className="absolute top-3 right-3 text-xl font-bold">✖</button>
              <h2 className="text-2xl font-semibold mb-6">{editingProcessor ? "Edit device model" : "Add device model"}</h2>
              <form className="space-y-4" onSubmit={handleSave}>
                <Input name="name" placeholder="Device Model Name" defaultValue={editingProcessor?.name || ""} required className="rounded-xl dark:bg-gray-800 dark:text-gray-100" />
                <select value={selectedBrandId || ""} onChange={e => setSelectedBrandId(parseInt(e.target.value))} className="w-full p-2 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                  <option value="">Select Brand</option>
                  {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                </select>
                <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all rounded-xl">{editingProcessor ? "Update" : "Create"}</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
