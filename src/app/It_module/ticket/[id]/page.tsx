'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User,  Send, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import TicketTimer from '@/components/dashboard/TicketTimer';
import StatusUpdate from '@/components/dashboard/transform';
import CommentComponent from '@/components/dashboard/itcomminettect';


interface Status {
  id: number;
  status: string;
  updatedById: number;
  updatedBy: string;
  transferToId: number | null;
  transferTo: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  duration: string | null;
}

interface Reply {
  id: number;
  user_id: number;
  name: string;
  role: string;
  ticket_id: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  job_title: string | null;
  role :string
}

interface TicketDetails {
  id: number;
  ticketNumber: string;
  title: string;
  content: string;
  status: string;
  des: string | null;
  avatar: string;
  category: {
    id: number;
    name: string;
    time: string;
  };
  openAt: string;
  closeAt: string;
  openAtformated: string;
  closeAtformatted: string;
  postponeNote: string | null;
  priority: string;
  rating: string;
  etaTime: number;
  dailyTime: number;
  dailyStatus: boolean;
  deviceId: number | null;
  device: {name:string, type:string} | null;
  employeeId: number;
  employee: Employee;
  responsibleId: number;
  responsibleName: string;
  responsibleJobTitle: string | null;
  responsibleEmail: string;
  createdById: number;
  createdByName: string;
  statuses: Status[];
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const ticketId = params.id as string;
  
  const [newReply, setNewReply] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ticket details');
      }

      const result = await response.json();
      return result.data as TicketDetails;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

    const fetchTicketDetails = () => {
      console.log('Fetching ticket details...', ticketId);
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
  };
  // Mutation for adding a reply
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

  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ticket_id: ticketId,
          status: status,
          updatedAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      setStatusUpdate('');
      toast.success('Status updated successfully');
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

  const handleStatusUpdate = () => {
    if (statusUpdate) {
      updateStatusMutation.mutate(statusUpdate);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'postponed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'urgent': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDailyStatus = (dailyTime: number) => {
    return dailyTime > 0 ? 'On time' : 'Overdue';
  };

  const getDailyStatusColor = (dailyTime: number) => {
    return dailyTime > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
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
          <div className="text-red-500">Error: {error.message}</div>
        </div>
      </MainLayout>
    );
  }

  if (!ticket) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Ticket not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ticket Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ticket Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      #{ticket.ticketNumber}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{ticket.title}</h2>
                </div>
                
                <div className="block items-center gap-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Created: {new Date(ticket.openAt).toLocaleDateString()}
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
<TicketTimer status={ticket.status} ticketId={ticketId} />
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Issue */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Ticket Issue</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ticket.content}</p>
                <div className="text-sm text-gray-500 mt-2">
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
              


              
              {ticket.avatar && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Attachment</h4>
                  <img 
                    src={ticket.avatar} 
                    alt="Ticket attachment" 
                    className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                  />
                </div>
              )}
            </div>


 {/* Ticket commit */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"> commit solve</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ticket.des}</p>
                <div className="text-sm text-gray-500 mt-2">
                </div>
              </div>
              


             
            </div>


            {/* Replies Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Replies ({ticket.replies.length})
              </h3>
              
              <div className="space-y-4 mb-4">
                {ticket.replies.map((reply) => (
                  <div key={reply.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{reply.name}</span>
                        <span className="text-sm text-gray-500">({reply.role})</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{reply.message}</p>
                  </div>
                ))}
                
                {ticket.replies.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No replies yet</p>
                )}
              </div>

              {/* Add Reply Form */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Add a reply</h4>
                <div className="flex gap-2">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Type your reply here..."
                    className="flex-1 border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:text-white"
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
              <CommentComponent 
              ticketId={parseInt(ticketId)} 
              onCommentAdded={fetchTicketDetails} 
            />
          </div>


             
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Ticket Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Device Type:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.device?.type || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Device:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.device?.name || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.category.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.category.time}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Daily Status:</span>
                  <span className={`font-medium ${getDailyStatusColor(ticket.dailyTime)}`}>
                    {getDailyStatus(ticket.dailyTime)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created By:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.createdByName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created At:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

<StatusUpdate 
  ticketId={ticketId} 
  currentStatus={ticket.status} 
  currentResponsibleId={ticket.responsibleId}
/>


            {/* Assigned HelpDesk */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Assigned HelpDesk</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Responsible:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.responsibleName || 'Unassigned'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Job Title:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.responsibleJobTitle || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.responsibleEmail || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Employee Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Employee Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.employee.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Job Title:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.employee.job_title || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.employee.email}</span>
                </div>
              </div>
            </div>

            {/* Ticket History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Ticket History</h3>
              
              <div className="space-y-3">
                {ticket.statuses.map((status, index) => (
                  <div key={status.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-indigo-500' : 'bg-gray-300'
                      }`} />
                      {index < ticket.statuses.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{status.updatedBy}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Changed status to {status.status} • {new Date(status.createdAt).toLocaleString()}
                      </div>
                      {status.duration && (
                        <div className="text-xs text-gray-500">Duration: {status.duration}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}