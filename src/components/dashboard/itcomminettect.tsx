import { useState } from 'react';
import { Send, Ticket } from "lucide-react";

interface CommentSelf {
  des: string;
}

interface CommentComponentProps {
  ticketId: number;
  onCommentAdded?: () => void;
}

async function addComment(ticketId: number, comment: string): Promise<CommentSelf[]> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket/${ticketId}/help-desk-description`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ des: comment })
  });

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }

  const result = await response.json();
  const users = result.data || result;

  return users;
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
      await addComment(ticketId, comment);
      setMessage('Comment added successfully!');
      setComment('');
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      setMessage('Failed to add comment. Please try again.');
      console.error('Error adding comment:', error);
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
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            'Adding...'
          ) : (
            <>
              <Send className="w-4 h-4" />
              Add Comment
            </>
          )}
        </button>
        
        {message && (
          <div className={`p-3 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CommentComponent;