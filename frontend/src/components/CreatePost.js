import React, { useState } from 'react';
import { FiImage, FiX } from 'react-icons/fi';
import { postsAPI } from '../services/api';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Please write something');
      return;
    }

    setSubmitting(true);
    try {
      const response = await postsAPI.createPost({
        content: content.trim(),
        imageUrl: imageUrl.trim()
      });
      
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
      
      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows="4"
          disabled={submitting}
        />
        
        {showImageInput && (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => {
                  setShowImageInput(false);
                  setImageUrl('');
                }}
                className="p-2 text-gray-500 hover:text-red-500"
              >
                <FiX size={20} />
              </button>
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-2 max-h-48 rounded-lg"
                onError={() => alert('Invalid image URL')}
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            disabled={submitting}
          >
            <FiImage />
            <span>Add Image</span>
          </button>
          
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;



