import React, { useState } from 'react';
import { FaStar, FaThumbsUp, FaReply, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewCard = ({ review, onUpdate, onDelete, showReplyForm = false }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editForm, setEditForm] = useState({
    rating: review.rating,
    title: review.title,
    comment: review.comment
  });
  const [replyForm, setReplyForm] = useState({ comment: '' });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.comment.trim()) {
      toast.error('Title and comment are required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`https://roomnmeal.onrender.com/api/reviews/${review._id}`, editForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Review updated successfully');
      setIsEditing(false);
      if (onUpdate) onUpdate(response.data.review);
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      setLoading(true);
      await axios.delete(`https://roomnmeal.onrender.com/api/reviews/${review._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Review deleted successfully');
      if (onDelete) onDelete(review._id);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyForm.comment.trim()) {
      toast.error('Reply comment is required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`https://roomnmeal.onrender.com/api/reviews/${review._id}/reply`, replyForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Reply added successfully');
      setIsReplying(false);
      setReplyForm({ comment: '' });
      if (onUpdate) onUpdate(response.data.review);
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async () => {
    try {
      const response = await axios.post(`https://roomnmeal.onrender.com/api/reviews/${review._id}/helpful`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (onUpdate) onUpdate(response.data.review);
    } catch (error) {
      console.error('Error updating helpful status:', error);
      toast.error('Failed to update helpful status');
    }
  };

  const canEdit = user && (user._id === review.userId?._id || user.role === 'admin');
  const canReply = user && (user.role === 'admin' || 
    (review.targetModel === 'Room' && user.role === 'host') ||
    (review.targetModel === 'MessPlan' && user.role === 'messProvider'));

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEditForm(prev => ({ ...prev, rating: star }))}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`h-5 w-5 ${
                      star <= editForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              value={editForm.comment}
              onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              maxLength={1000}
              required
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Review'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            {review.userId?.profileImage ? (
              <img
                src={review.userId.profileImage}
                alt={review.userId.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUser className="h-5 w-5 text-primary-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{review.userId?.name || 'Anonymous'}</h4>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Edit Review"
            >
              <FaEdit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600"
              title="Delete Review"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-3">
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-700">{review.comment}</p>
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-3">
          <div className="flex space-x-2 overflow-x-auto">
            {review.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        </div>
      )}

      {/* Review Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleHelpful}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
              review.helpful?.includes(user?._id)
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaThumbsUp className="h-3 w-3" />
            <span>{review.helpful?.length || 0}</span>
          </button>

          {canReply && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <FaReply className="h-3 w-3" />
              <span>Reply</span>
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          {review.isVerified && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <form onSubmit={handleReplySubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
              <textarea
                value={replyForm.comment}
                onChange={(e) => setReplyForm({ comment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
                placeholder="Write your reply..."
                maxLength={500}
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Reply'}
              </button>
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Reply */}
      {review.reply && (
        <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 rounded-lg p-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              {review.reply.userId?.profileImage ? (
                <img
                  src={review.reply.userId.profileImage}
                  alt={review.reply.userId.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FaUser className="h-4 w-4 text-primary-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">{review.reply.userId?.name || 'Provider'}</span>
                <span className="text-xs text-gray-500">
                  {new Date(review.reply.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{review.reply.comment}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
