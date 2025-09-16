'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {Send} from 'lucide-react'

interface Status {
  id: number
  status: string
  updatedById: number
  updatedBy: string
  transferToId: number | null
  transferTo: string | null
  note: string | null
  createdAt: string
  updatedAt: string
  duration: string | null
}

interface Reply {
  id: number
  user_id: number
  name: string
  role: string
  ticket_id: number
  message: string
  createdAt: string
  updatedAt: string
}

interface Employee {
  id: number
  name: string
  email: string
  role: string
}

interface Category {
  id: number
  name: string
  time: string
}

interface Ticket {
  id: number
  ticketNumber: string
  title: string
  content: string
  status: string
  des: string | null
  avatar: string | null
  category: Category
  openAt: string
  closeAt: string
  openAtformated: string
  closeAtformatted: string
  postponeNote: string | null
  priority: string
  rating: string
  etaTime: number
  dailyTime: number
  dailyStatus: boolean
  deviceId: number | null
  device: {name:string, type:string} | null
  employeeId: number
  employee: Employee
  responsibleId: number
  responsibleName: string
  responsibleJobTitle: string | null
  responsibleEmail: string
  createdById: number
  createdByName: string
  statuses: Status[]
  replies: Reply[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface CacheData {
  data: number | string;
  timestamp: number;
  expiresIn: number;
}

const CACHE_EXPIRY = 5 * 60 * 1000;

export default function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [error, setError] = useState('')
    const [newReply, setNewReply] = useState('');
      const queryClient = useQueryClient();
    
  

  const resolvedParams = use(params)
  const ticketId = resolvedParams.id


  const addReplyMutation = useMutation({
    mutationFn: async (message: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/replies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ticket_id: ticketId,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      setNewReply('');
      toast.success('Reply added successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
  
  const handleAddReply = () => {
    if (newReply.trim()) {
      addReplyMutation.mutate(newReply);
    }
  };


  const isValidCache = (cacheKey: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return false;
    
    try {
      const cacheData: CacheData = JSON.parse(cached);
      return Date.now() - cacheData.timestamp < cacheData.expiresIn;
    } catch {
      return false;
    }
  }

  const getCachedData = (cacheKey: string): Ticket | null => {
    if (typeof window === 'undefined') return null;
    if (!isValidCache(cacheKey)) return null;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const cacheData: CacheData = JSON.parse(cached);
         cacheData.data;
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  }

  const setCachedData = (cacheKey: string, data: string | number, expiresIn: number = CACHE_EXPIRY) => {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
        expiresIn
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)
        
        const cacheKey = `ticket_${ticketId}`;
        const cachedTicket = getCachedData(cacheKey);
        
        if (cachedTicket) {
          setTicket(cachedTicket);
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/${ticketId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch ticket');
        
        const data = await response.json()
        setTicket(data.data)
        
        if (data.data) {
          setCachedData(cacheKey, data.data);
        }
      } catch (error) {
        console.error('Error fetching ticket:', error)
        setError('Failed to load ticket details. Please try again.');
        setTicket(null)
      } finally {
        setLoading(false)
      }
    }
    
    if (ticketId) {
      fetchTicket()
    }
  }, [ticketId])

  const refreshTicket = async () => {
    try {
      setLoading(true);
      setError('');
      
      const cacheKey = `ticket_${ticketId}`;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(cacheKey);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch ticket');
      
      const data = await response.json()
      setTicket(data.data)
      
      if (data.data) {
        setCachedData(cacheKey, data.data);
      }
      
      setError('Ticket data refreshed successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Error refreshing ticket:', error)
      setError('Failed to refresh ticket data.');
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700'
      case 'closed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'progress': return 'bg-purple-100 text-purple-700'
      case 'transfered': return 'bg-indigo-100 text-indigo-700'
      case 'postponed': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-orange-100 text-orange-700'
      case 'low': return 'bg-green-100 text-green-700'
      case 'urgent': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const renderStatusHistory = () => {
    if (!ticket?.statuses?.length) return <p className="text-gray-500">No status history available</p>
    
    return (
      <div className="space-y-4">
        {ticket.statuses.map((status, index) => (
          <div key={status.id} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className={`w-3 h-3 rounded-full ${index === ticket.statuses.length - 1 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
              {index < ticket.statuses.length - 1 && <div className="w-0.5 h-12 "></div>}
            </div>
            <div className="flex-1 mb-4">
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(status.status)}`}>
                  {status.status}
                </span>
                <span className="text-xs text-gray-500">{status.createdAt}</span>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                Updated by: <span className="font-medium">{status.updatedBy}</span>
                {status.transferTo && (
                  <span> → Transferred to: <span className="font-medium">{status.transferTo}</span></span>
                )}
              </p>
              {status.duration && (
                <p className="text-xs text-gray-500 mt-1">Duration: {status.duration}</p>
              )}
              {status.note && (
                <p className="text-sm text-gray-700 mt-1">Note: {status.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderReplies = () => {
    if (!ticket?.replies?.length) return <p className="text-gray-500">No replies yet</p>
    
    return (
      <div className="space-y-4">
        {ticket.replies.map((reply) => (
          <div key={reply.id} className={`p-4 rounded-lg ${reply.role === 'employee' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-gray-900">{reply.name}</span>
                <span className={`ml-2 text-xs px-2 py-1 rounded ${reply.role === 'employee' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                  {reply.role}
                </span>
              </div>
              <span className="text-xs text-gray-500">{reply.createdAt}</span>
            </div>
            <p className="text-gray-800">{reply.message}</p>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-bold text-indigo-700">Ticket not found</h3>
          <p className="mt-2 text-gray-600">The requested ticket could not be found.</p>
          <button
            onClick={() => router.push('/employee/tickets')}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">Ticket Details</h1>
          
          <div className="flex items-center gap-3">
            <button
              onClick={refreshTicket}
              className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center gap-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
            
            <button
              onClick={() => router.push('/employee/tickets')}
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Tickets
            </button>
          </div>
        </div>

        {/* Error/Success Message */}
        {error && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            error.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">{ticket.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(ticket.status)}`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityColor(ticket.priority)}`}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    #{ticket.ticketNumber}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-indigo-100">Created: {ticket.createdAt}</p>
                {ticket.closeAt && (
                  <p className="text-indigo-100">Closed: {ticket.closeAt}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {['details', 'status', 'replies'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium text-sm focus:outline-none ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab === 'details' && 'Ticket Details'}
                  {tab === 'status' && `Status History (${ticket.statuses?.length || 0})`}
                  {tab === 'replies' && `Replies (${ticket.replies?.length || 0})`}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Category</span>
                      <span className="text-gray-900">{ticket.category?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Created By</span>
                      <span className="text-gray-900">{ticket.employee?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Assigned To</span>
                      <span className="text-gray-900">{ticket.responsibleName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">ETA Time</span>
                      <span className="text-gray-900">{ticket.etaTime} minutes</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Rating</span>
                      <span className="text-gray-900">{ticket.rating || 'Not rated'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-line">{ticket.content}</p>
                  </div>

                  {ticket.avatar && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Attachment</h3>
                      <div className="border rounded-lg p-2">
                        <img 
                          src={ticket.avatar} 
                          alt="Ticket attachment" 
                          className="max-w-full h-auto rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'status' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                {renderStatusHistory()}
              </div>
            )}

            {activeTab === 'replies' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h3>
                {renderReplies()}
                 <div className="border-t pt-4">
                                <h4 className="text-md font-medium text-gray-900 dark:text-black-100 mb-2">Add a reply</h4>
                                <div className="flex gap-2">
                                  <textarea
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    placeholder="Type your reply here..."
                                    className="flex-1 border border-gray-300 rounded-md p-2 bg-gray-400 text-black  "
                                  />
                                  <Button 
                                    onClick={handleAddReply}
                                    disabled={addReplyMutation.isPending}
                                    className="self-end"
                                  >
                                    <Send className="w-4 h-4 mr-1" />
                                    Send
                                  </Button>
                                </div>
                              </div>
              </div>
            
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Employee Information</h3>
            <p className="text-sm text-gray-600">{ticket.employee?.name}</p>
            <p className="text-sm text-gray-600">{ticket.employee?.email}</p>
            <p className="text-sm text-gray-600 capitalize">{ticket.employee?.role}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Responsible Person</h3>
            <p className="text-sm text-gray-600">{ticket.responsibleName}</p>
            <p className="text-sm text-gray-600">{ticket.responsibleEmail}</p>
            {ticket.responsibleJobTitle && (
              <p className="text-sm text-gray-600">{ticket.responsibleJobTitle}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
            <p className="text-sm text-gray-600">Created: {ticket.createdAt}</p>
            {ticket.closeAtformatted && (
              <p className="text-sm text-gray-600">Closed: {ticket.closeAtformatted}</p>
            )}
            <p className="text-sm text-gray-600">Last Update: {ticket.updatedAt}</p>
            {ticket.postponeNote && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Postpone Note:</p>
                <p className="text-sm text-gray-600">{ticket.postponeNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}