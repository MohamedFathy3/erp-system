'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

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

  // Fetch tickets with improved caching
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}ticket`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch tickets');
      
      const data = await response.json();
      return data.data || [];
    },
    staleTime: 5 * 60 * 1000,
  })

  // Fetch categories only when needed (when modal is opened)
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      return data.data || [];
    },
    staleTime: 10 * 60 * 1000, // Longer cache time for categories
    enabled: isModalOpen, // Only fetch when modal is open
  })

  // Priorities with improved error handling and caching
  const { data: priorities, isLoading: prioritiesLoading } = useQuery({
    queryKey: ['priorities'],
    queryFn: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/priorities`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.data || [];
        }
        
        throw new Error('API not available, using fallback data');
      } catch (error) {
        console.warn('Failed to fetch priorities, using fallback data:', error);
        
        const fallbackPriorities = [
          { id: 'low', name: 'Low' },
          { id: 'medium', name: 'Medium' },
          { id: 'high', name: 'High' },
          { id: 'urgent', name: 'Urgent' }
        ];
        
        return fallbackPriorities;
      }
    },
    staleTime: 10 * 60 * 1000, // Longer cache time
    enabled: isModalOpen, // Only fetch when modal is open
  })

  // Types with conditional fetching
  const { data: types, isLoading: typesLoading } = useQuery({
    queryKey: ['types'],
    queryFn: async () => {
      const payload = {
        filters: {
          type: "device", 
        },
        orderBy: 'id',  
        deleted: false,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type/index`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to fetch types');
      
      const data = await response.json();
      return data.data || [];
    },
    staleTime: 10 * 60 * 1000,
    enabled: isModalOpen, // Only fetch when modal is open
  })

  // Apply filter with useCallback to prevent unnecessary recreations
  const applyFilter = useCallback((filter: string, ticketsData: Ticket[] = []) => {
    if (!ticketsData.length) return;
    
    if (filter === 'all') {
      setFilteredTickets(ticketsData);
    } else {
      setFilteredTickets(ticketsData.filter((t: Ticket) => t.status === filter));
    }
  }, []);

  // Apply filters when tickets or activeFilter changes
  useEffect(() => {
    if (tickets && tickets.length) {
      applyFilter(activeFilter, tickets);
    }
  }, [tickets, activeFilter, applyFilter]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  }

  // Memoized input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTicket(prev => ({
        ...prev,
        avatar: e.target.files![0]
      }));
    }
  }

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-by-employee`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create ticket');
      }
      toast.success('Ticket created successfully!')
      return response.json();
    },

    onSuccess: () => {
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
      setError('');
    },
    onError: (error: Error) => {
      setError(error.message || 'An error occurred while creating the ticket');
    },
    onSettled: () => {
      setUploading(false);
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', newTicket.title);
      formData.append('content', newTicket.content);
      formData.append('category_id', newTicket.category_id);
      formData.append('type_id', newTicket.type_id);
      formData.append('priority', newTicket.priority);
      formData.append('device_id', newTicket.device_id);
      formData.append('status', newTicket.status);
      
      if (newTicket.avatar) {
        formData.append('avatar', newTicket.avatar);
      }

      createTicketMutation.mutate(formData);
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError('An error occurred while creating the ticket');
      setUploading(false);
    }
  }

  // Memoized utility functions
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'progress': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
      case 'urgent': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const closeModal = useCallback(() => {
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
  }, []);

  const refreshData = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
    setError('Data refreshed successfully!');
    setTimeout(() => setError(''), 3000);
  }, [queryClient]);

  const loading = ticketsLoading;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="px-4 py-2 m-5 p-5 rounded-lg"
        >
          &#8592; Back
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="text-gray-600 mt-2 dark:text-white">Manage and track your support tickets</p>
          
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
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
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
                    <label htmlFor="type_id" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      id="type_id"
                      name="type_id"
                      value={newTicket.type_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    >
                      <option value="">Select Type</option>
                      {typesLoading ? (
                        <option disabled>Loading types...</option>
                      ) : (
                        types?.map((type: Type) => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      id="category_id"
                      name="category_id"
                      value={newTicket.category_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    >
                      <option value="">Select Category</option>
                      {categoriesLoading ? (
                        <option disabled>Loading categories...</option>
                      ) : (
                        categories?.map((category: Category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={newTicket.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="">Select Priority</option>
                    {prioritiesLoading ? (
                      <option disabled>Loading priorities...</option>
                    ) : (
                      priorities?.map((priority: Priority) => (
                        <option key={priority.id} value={priority.id}>{priority.name}</option>
                      ))
                    )}
                  </select>
                </div>
                
                {/* Rest of the form remains the same */}
                {/* ... */}
                
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