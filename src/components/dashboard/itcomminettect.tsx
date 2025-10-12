import { useState } from 'react';
import { Send, Ticket } from "lucide-react";
import { apiFetch } from '@/lib/api';

interface CommentSelf {
  des: string;
}

interface CommentComponentProps {
  ticketId: number;
  onCommentAdded?: () => void;
}

const CommentComponent = ({ ticketId, onCommentAdded }: CommentComponentProps) => {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!comment.trim()) {
    setMessage('Please enter a comment');
    return;
  }

  setIsLoading(true);
  setMessage('');

  try {
    console.log('🔄 Adding comment for ticket:', ticketId);
    
    // جرب POST بدلاً من PATCH
    const responseData = await apiFetch(`/ticket/${ticketId}/help-desk-description`, {
      method: 'PATCH',
      body: JSON.stringify({ des: comment })
    });

    console.log('✅ Comment response:', responseData);

    setMessage('Comment added successfully!');
    setComment('');
    
    if (onCommentAdded) {
      onCommentAdded();
    }
  } catch (error) {
    console.error('❌ Error adding comment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to add comment. Please try again.';
    setMessage(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Ticket className="w-5 h-5" />
        Add Comment
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your comment here..."
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !comment.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </div>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Add Comment
            </>
          )}
        </button>
        
        {message && (
          <div className={`p-3 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.includes('successfully') ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className="text-red-600">✗</span>
              )}
              {message}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CommentComponent;