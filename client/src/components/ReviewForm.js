import React, { useState } from 'react';
import { FaStar, FaCamera, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewForm = ({ targetId, targetModel, onSubmit, onCancel, existingReview = null }) => {
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 5,
    title: existingReview?.title || '',
    comment: existingReview?.comment || '',
    images: existingReview?.images || []
  });
  const [loading, setLoading] = useState(false);
  const [imageUploads, setImageUploads] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length === 0) {
      toast.error('Please select valid image files (max 5MB each)');
      return;
    }

    if (formData.images.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // For now, we'll use FileReader to preview images
    // In production, you'd upload to Cloudinary or similar service
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
        setImageUploads(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageUploads(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.comment.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      toast.error('Please select a valid rating');
      return;
    }

    try {
      setLoading(true);

      // In a real implementation, you'd upload images first
      // For now, we'll just submit the form data
      const reviewData = {
        targetId,
        targetModel,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        images: formData.images
      };

      if (existingReview) {
        // Update existing review
        const response = await axios.put(
          `https://roomnmeal.onrender.com/api/reviews/${existingReview._id}`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        toast.success('Review updated successfully');
        if (onSubmit) onSubmit(response.data.review);
      } else {
        // Create new review
        const response = await axios.post(
          'https://roomnmeal.onrender.com/api/reviews',
          reviewData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        toast.success('Review submitted successfully');
        if (onSubmit) onSubmit(response.data.review);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit review');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = true) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => interactive && handleRatingChange(index + 1)}
        className={`focus:outline-none transition-colors ${
          interactive ? 'hover:scale-110' : ''
        }`}
        disabled={!interactive}
      >
        <FaStar
          className={`h-6 w-6 ${
            index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {existingReview ? 'Edit Review' : 'Write a Review'}
        </h3>
        <p className="text-sm text-gray-600">
          Share your experience and help others make informed decisions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Rating *
          </label>
          <div className="flex items-center space-x-2">
            {renderStars(formData.rating)}
            <span className="ml-3 text-sm text-gray-600">
              {formData.rating} out of 5
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Summarize your experience in a few words"
            maxLength={100}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Review *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Share the details of your experience..."
            maxLength={1000}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.comment.length}/1000 characters
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <div className="space-y-3">
            {/* Image Upload Button */}
            {formData.images.length < 5 && (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaCamera className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {formData.images.length}/5 images
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Review Guidelines */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Review Guidelines</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Be honest and accurate in your review</li>
          <li>• Focus on your personal experience</li>
          <li>• Avoid offensive or inappropriate language</li>
          <li>• Don't include personal information about others</li>
          <li>• Reviews are moderated and may take time to appear</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewForm;
