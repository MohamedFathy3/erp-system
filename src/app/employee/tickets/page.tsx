'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'

interface Category {
  id: number;
  name: string;
}

interface Priority {
  id: string;
  name: string;
}

interface Type {
  id: number;
  name: string;
}

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
}

export default function SupportTicketsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: '',
    content: '',
    category_id: '',
    type_id: '',
    priority: 'medium',
    avatar: null as File | null,
    device_id: '1',
    status: 'pending'
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // استخدام React Query مع apiFetch لجلب البيانات
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching tickets...');
        const responseData = await apiFetch('/ticket');
        console.log('✅ Tickets response:', responseData);

        if (!responseData || !responseData.data) {
          throw new Error('No tickets data received');
        }

        return responseData.data;
      } catch (error) {
        console.error('❌ Error fetching tickets:', error);
        throw new Error('Failed to fetch tickets');
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching categories...');
        const responseData = await apiFetch('/category');
        console.log('✅ Categories response:', responseData);

        if (!responseData || !responseData.data) {
          throw new Error('No categories data received');
        }

        return responseData.data;
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: priorities, isLoading: prioritiesLoading } = useQuery({
    queryKey: ['priorities'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching priorities...');
        
        // جرب جلب الأولويات من الـ API
        try {
          const responseData = await apiFetch('/priorities');
          console.log('✅ Priorities response:', responseData);

          if (responseData && responseData.data) {
            return responseData.data;
          }
        } catch (apiError) {
          console.warn('❌ API priorities not available, using fallback data');
        }
        
        // استخدام البيانات الافتراضية إذا فشل الـ API
        const fallbackPriorities = [
          { id: 'low', name: 'Low' },
          { id: 'medium', name: 'Medium' },
          { id: 'high', name: 'High' },
          { id: 'urgent', name: 'Urgent' }
        ];
        
        return fallbackPriorities;
      } catch (error) {
        console.error('❌ Error fetching priorities:', error);
        throw new Error('Failed to fetch priorities');
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: types, isLoading: typesLoading } = useQuery({
    queryKey: ['types'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching types...');
        
        const payload = {
          filters: {
            type: "device", 
          },
          orderBy: 'id',  
          deleted: false,
        };
        
        const responseData = await apiFetch('/type/index', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        console.log('✅ Types response:', responseData);

        if (!responseData || !responseData.data) {
          throw new Error('No types data received');
        }

        return responseData.data;
      } catch (error) {
        console.error('❌ Error fetching types:', error);
        throw new Error('Failed to fetch types');
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  // تطبيق الفلتر عندما تتغير التذاكر أو الفلتر النشط
  useEffect(() => {
    if (tickets) {
      applyFilter(activeFilter);
    }
  }, [tickets, activeFilter])

  const applyFilter = (filter: string) => {
    if (!tickets) return;
    
    if (filter === 'all') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter((t: Ticket) => t.status === filter));
    }
  }

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTicket(prev => ({
        ...prev,
        avatar: e.target.files![0]
      }));
    }
  }

  // استخدام React Query للتحولات (Mutations) مع apiFetch - باستخدام JSON بدلاً من FormData
  const createTicketMutation = useMutation({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (ticketData: any) => {
      console.log('🔄 Creating ticket...');
      console.log('📤 Ticket data:', ticketData);
      
      // استخدام apiFetch مع JSON بدلاً من FormData
      const responseData = await apiFetch('/create-by-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData)
      });

      console.log('✅ Ticket creation response:', responseData);

      if (!responseData) {
        throw new Error('Failed to create ticket');
      }

      return responseData;
    },
    onSuccess: (data) => {
      console.log('🎉 Ticket created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsModalOpen(false);
      setNewTicket({
        title: '',
        content: '',
        category_id: '',
        type_id: '',
        priority: 'medium',
        avatar: null,
        device_id: '1',
        status: 'pending'
      });
      toast.success('Ticket created successfully!');
      setError('');
    },
    onError: (error: Error) => {
      console.error('❌ Ticket creation error:', error);
      setError(error.message || 'An error occurred while creating the ticket');
      toast.error('Failed to create ticket');
    },
    onSettled: () => {
      setUploading(false);
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    
    // التحقق من الحقول المطلوبة
    if (!newTicket.title || !newTicket.content || !newTicket.category_id || !newTicket.type_id) {
      setError('Please fill all required fields');
      setUploading(false);
      return;
    }
    
    try {
      const ticketData = {
        title: newTicket.title,
        content: newTicket.content,
        category_id: parseInt(newTicket.category_id),
        type_id: parseInt(newTicket.type_id),
        priority: newTicket.priority,
        device_id: parseInt(newTicket.device_id),
        status: newTicket.status,
        // إذا كان الـ API يتوقع ملف، يمكنك إضافة منطق لتحويل الملف إلى base64 هنا
        // avatar: newTicket.avatar ? await convertFileToBase64(newTicket.avatar) : null
      };

      console.log('📤 Sending ticket data:', ticketData);
      createTicketMutation.mutate(ticketData);
    } catch (error) {
      console.error('❌ Error creating ticket:', error);
      setError('An error occurred while creating the ticket');
      setUploading(false);
    }
  }

  // دالة لتحويل الملف إلى base64 (إذا كان الـ API يتطلبه)
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'progress': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
      case 'urgent': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setNewTicket({
      title: '',
      content: '',
      category_id: '',
      type_id: '',
      priority: 'medium',
      avatar: null,
      device_id: '1',
      status: 'pending'
    });
  }

  const refreshData = async () => {
    // إعادة جلب جميع البيانات
    await queryClient.invalidateQueries({ queryKey: ['tickets'] });
    await queryClient.invalidateQueries({ queryKey: ['categories'] });
    await queryClient.invalidateQueries({ queryKey: ['priorities'] });
    await queryClient.invalidateQueries({ queryKey: ['types'] });
    
    toast.success('Data refreshed successfully!');
  }

  const loading = ticketsLoading || categoriesLoading || prioritiesLoading || typesLoading;

  // عرض loading spinner أثناء التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your tickets...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          {/* يمكنك إضافة محتوى هنا إذا كان مطلوبًا */}
        </div>
        

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-2">Manage and track your support tickets</p>
          
          {/* Refresh Button */}
          <button
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center gap-2 mx-auto transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh Data
          </button>
        </div>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 mb-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        {/* Error/Success Message */}
        {error && (
          <div className={`px-4 py-3 rounded-lg mb-6 ${
            error.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-2">
            {['all', 'open', 'progress', 'pending', 'closed'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filter === 'all' ? 'All Tickets' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                {filter !== 'all' && (
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tickets?.filter((t: Ticket) => t.status === filter).length || 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Ticket
          </button>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-4">Get started by creating a new support ticket</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create New Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{ticket.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ticket.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="font-mono">#{ticket.ticketNumber}</span>
                    <span>{formatDate(ticket.openAt)}</span>
                  </div>
                  
                  {ticket.category && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded">
                        {ticket.category.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600">By: {ticket.employee?.name || 'Unknown'}</span>
                  <button
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                    onClick={() => router.push(`/employee/tickets/${ticket.id}`)}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Ticket Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type_id"
                      name="type_id"
                      value={newTicket.type_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    >
                      <option value="">Select Type</option>
                      {types?.map((type: Type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category_id"
                      name="category_id"
                      value={newTicket.category_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories?.map((category: Category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={newTicket.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="">Select Priority</option>
                    {priorities?.map((priority: Priority) => (
                      <option key={priority.id} value={priority.id}>{priority.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTicket.title}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive title for your ticket"
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={newTicket.content}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Provide detailed information about your issue or request"
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="avatar" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                          <span>Upload a file</span>
                          <input 
                            id="avatar" 
                            name="avatar" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  {newTicket.avatar && (
                    <p className="mt-2 text-sm text-gray-600">Selected file: {newTicket.avatar.name}</p>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}