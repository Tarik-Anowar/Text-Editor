import React, { useState } from 'react';
import { MessageSquare, X, Plus, Check, Trash2 } from 'lucide-react';
import { EditorComment } from '../types/editor';

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  comments: EditorComment[];
  onAddComment: (comment: Omit<EditorComment, 'id' | 'timestamp'>) => void;
  onUpdateComment: (commentId: string, updates: Partial<EditorComment>) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment({
        content: newComment,
        author: 'Current User',
        position: 0,
        resolved: false,
      });
      setNewComment('');
    }
  };

  return (
    <div className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Add Comment */}
      <div className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-20"
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border ${
                comment.resolved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium text-sm text-gray-700">{comment.author}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {comment.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onUpdateComment(comment.id, { resolved: !comment.resolved })}
                    className={`p-1 rounded transition-colors ${
                      comment.resolved
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={comment.resolved ? 'Mark as unresolved' : 'Mark as resolved'}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="p-1 rounded text-red-400 hover:text-red-600 transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};