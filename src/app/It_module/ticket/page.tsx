'use client';

import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from "@/lib/api";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AddTicketModal from '@/components/dashboard/AddTicketModal';
import Pagination from "@/components/Tablecomponents/Pagination";
import FilterSearch from "@/components/Tablecomponents/FilterSearch/FilterSearch";
import { FilterField } from '@/types/generic-data-manager';

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
  dailyStatus: boolean;
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

// تعريف الفلاتر المتاحة للتذاكر
const availableFilters: FilterField[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'open', label: 'Open' },
      { value: 'closed', label: 'Closed' },
      { value: 'pending', label: 'Pending' },
      { value: 'transfered', label: 'Transfered' }
    ]
  },
  {
    key: 'priority',
    label: 'Priority',
    type: 'select',
    options: [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' },
      { value: 'urgent', label: 'Urgent' }
    ]
  },
  {
    key: 'ticketNumber',
    label: 'Ticket Number',
    type: 'text',
    placeholder: 'Search by ticket number...'
  },
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Search by title...'
  }
];

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // States
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [perPage, setPerPage] = useState(15);
  const [orderBy, setOrderBy] = useState('id');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<Record<string, string>>({});

  // استخدام React Query لجلب البيانات
  const {
    data: apiResponse,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tickets', currentPage, perPage, orderBy, orderByDirection, filters, search],
    queryFn: async (): Promise<ApiResponse> => {
      console.log('🔄 Fetching tickets for page:', currentPage);
      
      const response = await apiFetch(`/ticket/index`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: filters,                
          orderBy: orderBy,           
          orderByDirection: orderByDirection,
          perPage: perPage,
          paginate: true,           
          page: currentPage,                 
        }),
      });

      console.log('✅ API Data received:', response);
      
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }
      
      return response;
    },
    staleTime: 2 * 60 * 1000, // البيانات تظل "طازجة" لمدة 2 دقائق
    gcTime: 5 * 60 * 1000, // وقت التخزين المؤقت 5 دقائق
    retry: 2,
  });

  const data = apiResponse?.data || [];
  const pagination = apiResponse?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    links: []
  };

  // Filter data locally based on search
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      search === "" || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.priority.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, orderBy, orderByDirection, search]);

  // معالجة الأخطاء
  if (isError) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    toast.error(`Failed to fetch tickets: ${errorMessage}`);
  }

  const handleTicketAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
    toast.success('Ticket added successfully!');
  };

  // دالة لمعالجة الضغط على View مع React Query
  const handleViewTicket = async (ticketId: number) => {
    try {
      console.log(`🔄 Fetching ticket details for ID: ${ticketId}`);
      
      await queryClient.prefetchQuery({
        queryKey: ['ticket', ticketId],
        queryFn: async () => {
          const ticketData = await apiFetch(`/ticket/${ticketId}`);
          return ticketData;
        },
        staleTime: 2 * 60 * 1000,
      });

      router.push(`/It_module/ticket/${ticketId}`);
      
    } catch (err) {
      console.error('❌ Error fetching ticket details:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch ticket details";
      toast.error(errorMessage);
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
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'transfered': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'urgent': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const allSelected = filteredData.length > 0 && filteredData.every(item => selectedItems.has(item.id));
  const someSelected = filteredData.some(item => selectedItems.has(item.id));

  const handleAddTicket = () => {
    setIsAddModalOpen(true);
  };

  const handleApplyFilter = () => {
    console.log("Filters applied:", filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    setOrderBy('id');
    setOrderByDirection('desc');
    setSearch("");
  };

  const handleSearch = () => {
    console.log("Search performed:", search);
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🎫 Tickets Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all support tickets
            </p>
          </div>
          <Button 
            onClick={handleAddTicket}
            className="bg-green-600 hover:bg-green-700"
          >
            ➕ Add Ticket
          </Button>
        </div>

        {/* FilterSearch Component */}
        <FilterSearch
          search={search}
          onSearchChange={setSearch}
          onSearch={handleSearch}
          filters={filters}
          onFiltersChange={setFilters}
          orderBy={orderBy}
          onOrderByChange={setOrderBy}
          orderByDirection={orderByDirection}
          onOrderByDirectionChange={setOrderByDirection}
          onApplyFilter={handleApplyFilter}
          onResetFilters={handleResetFilters}
          showFilter={showFilter}
          onToggleFilter={() => setShowFilter(!showFilter)}
          showSearch={true}
          showFilterSection={true}
          availableFilters={availableFilters}
        />

        {/* Debug Info */}
        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-900/30 dark:to-blue-800/30 text-black dark:text-blue-200 border-b border-blue-100 dark:border-blue-900/50 font-semibold text-lg px-6 py-4">
            Tickets Management
          </div>

          {/* Table Info Bar */}
          <div className="p-4 flex items-center justify-between bg-white dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isLoading ? 'Loading...' : `Showing ${filteredData.length} of ${pagination.total} tickets`}
              </span>
            </div>
          </div>

          {/* Table */}
          {!isLoading && (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left w-12">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4"
                      />
                    </th>
                    {["ID", "Ticket #", "Status", "Priority", "Actions"].map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.length ? (
                    filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onChange={() => toggleSelectItem(item.id)}
                            className="h-4 w-4"
                          />
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-gray-700 dark:text-gray-300">{item.ticketNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate" title={item.title}>
                          {item.title}
                        </td>
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
                      
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewTicket(item.id)}
                              className="flex items-center gap-2 relative bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs"
                            >
                              {/* تأثير الـ Ping */}
                              {item.dailyStatus === true && (
                                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-red-400 opacity-75 -top-1 -left-1"></span>
                              )}
                              
                              <Eye className="w-4 h-4 relative z-10" />
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center py-8">
                          <i className="fas fa-inbox text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                          <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
                            No tickets found
                          </div>
                          <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            {search || Object.keys(filters).length > 0 ? 'No tickets match your search criteria' : 'Get started by adding a new ticket'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-4 text-gray-600 dark:text-gray-300">Loading tickets...</span>
            </div>
          )}

          {/* Pagination */}
    
        </div>
      {!isLoading && filteredData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              lastPage={pagination.last_page}
              total={pagination.total}
              perPage={perPage}
              onPageChange={setCurrentPage}
              className="mt-0"
            />
          )}
        {/* Add Ticket Modal */}
        <AddTicketModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onTicketAdded={handleTicketAdded}
        />
      </div>
    </MainLayout>
  );
}