'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Send, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import TicketTimer from '@/components/dashboard/TicketTimer';
import StatusUpdate from '@/components/dashboard/transform';
import CommentComponent from '@/components/dashboard/itcomminettect';
import { apiFetch } from '@/lib/api';
import { TicketDetails } from '@/types/pagetecite';
import { getStatusColor, getPriorityColor, getDailyStatus, getDailyStatusColor } from '@/components/skeletons/tecitstuts';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const ticketId = params.id as string;
  
  const [newReply, setNewReply] = useState('');
  const [isRefetching, setIsRefetching] = useState(false);

  // تصحيح دالة fetch التذكرة
  const { data: ticket, isLoading, error, refetch } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async (): Promise<TicketDetails> => {
      try {
        console.log(`🔄 Fetching ticket with ID: ${ticketId}`);
        
        // apiFetch يرجع البيانات مباشرة، ليس Response object
        const responseData = await apiFetch(`/ticket/${ticketId}`);
        console.log('✅ API Response data:', responseData);

        if (!responseData || !responseData.data) {
          throw new Error('No data received from server');
        }

        return responseData.data as TicketDetails;
      } catch (err) {
        console.error('❌ Error fetching ticket:', err);
        throw new Error('Failed to load ticket details. Please try again.');
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // دالة لإعادة جلب البيانات
  const fetchTicketDetails = useCallback(async () => {
    setIsRefetching(true);
    try {
      await refetch();
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refetching:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsRefetching(false);
    }
  }, [refetch]);

  // تصحيح Mutation for adding a reply
  const addReplyMutation = useMutation({
    mutationFn: async (message: string) => {
      const responseData = await apiFetch(`/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket_id: parseInt(ticketId),
          message: message
        })
      });

      console.log('✅ Reply response:', responseData);

      if (!responseData) {
        throw new Error('Failed to add reply');
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      setNewReply('');
      toast.success('Reply added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleAddReply = () => {
    if (newReply.trim()) {
      addReplyMutation.mutate(newReply);
    }
  };

  // حالة التحميل
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </MainLayout>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-64 space-y-4 p-4">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">Error loading ticket</p>
            <p className="mt-2">{error.message}</p>
            <p className="text-sm mt-2">Ticket ID: {ticketId}</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => refetch()} className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // إذا لم يتم العثور على التذكرة
  if (!ticket) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p className="text-gray-500 text-lg">Ticket not found</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Ticket Details</h1>
          </div>
          <Button
            onClick={fetchTicketDetails}
            disabled={isRefetching}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ticket Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
              <div className="flex flex-col justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      #{ticket.ticketNumber}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">{ticket.title}</h2>
                </div>
                
                <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <div>Created: {new Date(ticket.openAt).toLocaleDateString()}</div>
                  <div>
                    <TicketTimer status={ticket.status} ticketId={ticketId} />
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Issue */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
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
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Ticket commit */}
            {ticket.des && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Commit Solve</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ticket.des}</p>
                </div>
              </div>
            )}

            {/* Replies Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Replies ({ticket.replies?.length || 0})
              </h3>
              
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {ticket.replies?.map((reply) => (
                  <div key={reply.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
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
                
                {(!ticket.replies || ticket.replies.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No replies yet</p>
                )}
              </div>

              {/* Add Reply Form */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Add a reply</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Type your reply here..."
                    className="flex-1 border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:text-white min-h-[80px]"
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddReply}
                    disabled={addReplyMutation.isPending || !newReply.trim()}
                    className="self-end sm:self-auto"
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

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
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
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.category?.name || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.category?.time || 'N/A'}</span>
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
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.createdByName || 'N/A'}</span>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Employee Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.employee?.name || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Job Title:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.employee?.job_title || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.employee?.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Ticket History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Ticket History</h3>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {ticket.statuses?.map((status, index) => (
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
                )) || (
                  <p className="text-gray-500 text-center py-4">No status history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}