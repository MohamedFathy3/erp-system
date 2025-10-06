'use client';

import { useState, useEffect } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { apiFetch } from "@/lib/api";

import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  Eye } from "lucide-react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import '@/styles/ticit.css';
import AddTicketModal from '@/components/dashboard/AddTicketModal';



interface Ticket {
  id: number;
  ticketNumber: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  openAt: string;
  category?: { name: string };
  employee?: { name: string };
  company?: string;
  dailyStatus:boolean;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface ApiResponse {
  data: Ticket[];
  meta: PaginationMeta;
}

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  className?: string;
}

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<Ticket[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter,] = useState(false);
  const [perPage] = useState(15);
  const [orderBy,] = useState('id');
  const [orderByDirection,] = useState('asc');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 7,
    total: 0,
    links: []
  });

  useEffect(() => {
    if (!showFilter) {
      fetchTickets(currentPage);
    }
  }, [currentPage]);

async function fetchTickets(page = 1) {
  try {
    setLoading(true);
    
    const response = await apiFetch(`/ticket/index`, {
      method: "POST",
      body: JSON.stringify({
        filters: {},                
        orderBy: orderBy,           
        orderByDirection: orderByDirection,
        perPage: perPage,
        paginate: true,           
        page: page,                 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error("Failed to fetch data");
    }

    const json: ApiResponse = await response.json();
    setData(json.data || []);
    setPagination(json.meta); 
  } catch (err) {
    toast.error("Failed to fetch tickets");
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setLoading(false);
  }
}



    const handleTicketAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
  };


 



const handleChangeStatusAndNavigate = async (id: number, status: string) => {
  if (status === 'open' || status === 'closed' || status === 'transfered' || status === 'postponed') {
    router.push(`/It_module/ticket/${id}`);
    return;
  }

  try {
   

    const res = await apiFetch(`/ticket/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: 'open' }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error('API error response:', res.status, data);
      throw new Error(data?.message || `Server responded with status ${res.status}`);
    }

    toast.success('Status changed successfully to open!');
    router.push(`/It_module/ticket/${id}`);
  } catch (err) {
    console.error('Unexpected error:', err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
        ? err
        : 'An unknown error occurred';

    toast.error(`Failed to change ticket status: ${message}`);
    setError(message);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'transfered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

 

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.ticketNumber.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = filteredData.length > 0 && filteredData.every(item => selectedItems.has(item.id));
  const someSelected = filteredData.some(item => selectedItems.has(item.id));

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tickets</h1>
          </div>
         
        </div>

        {/* Search */}
        <Input
          placeholder="Search tickets..."
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
                {["ID", "Ticket #", "Title", "Status", "Priority", "Category", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white text-center dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
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
                    <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">{item.ticketNumber}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {item.category?.name || 'No Category'}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
onClick={() => handleChangeStatusAndNavigate(item.id, item.status)}
                      >
                      {item.dailyStatus === true ? (
  <div className="relative flex items-center justify-center w-10 h-10">
    <span className="soft-ping"></span>
    <Eye className="w-5 h-5 text-red-600 z-10" />
  </div>
) : (
  <Eye className="w-4 h-4 text-gray-400" />
)}


                        View
                      </Button>
                   
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No tickets found
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
              <AddTicketModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTicketAdded={handleTicketAdded}
      />
      </div>
    </MainLayout>
  );
}