import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { FiArrowLeft } from 'react-icons/fi';

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(postId);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Post not found</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Go to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-4"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <PostCard post={post} onDelete={handlePostDeleted} />
      </div>
    </div>
  );
};

export default SinglePost;



