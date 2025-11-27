import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiTrash2, FiEdit } from 'react-icons/fi';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = post.userId?._id === user?.id;

  const handleLike = async () => {
    try {
      const response = await postsAPI.likePost(post._id);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await postsAPI.addComment(post._id, comment);
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await postsAPI.deleteComment(post._id, commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;

    try {
      await postsAPI.deletePost(post._id);
      if (onDelete) onDelete(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.userId?._id}`}>
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg">
              {post.userId?.studentId?.name?.charAt(0).toUpperCase()}
            </div>
          </Link>
          <div>
            <Link to={`/profile/${post.userId?._id}`} className="font-semibold text-gray-900 hover:text-primary-600">
              {post.userId?.studentId?.name}
            </Link>
            <div className="text-sm text-gray-500">
              {post.userId?.studentId?.department} • {post.userId?.studentId?.batch}
            </div>
            <div className="text-xs text-gray-400">{formatDate(post.createdAt)}</div>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDeletePost}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      {/* Post Content */}
      <Link to={`/post/${post._id}`}>
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full rounded-lg mb-4 max-h-96 object-cover"
          />
        )}
      </Link>

      {/* Post Actions */}
      <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <FiHeart className={isLiked ? 'fill-current' : ''} />
          <span>{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-500 hover:text-primary-600"
        >
          <FiMessageCircle />
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c._id} className="flex space-x-3">
                <Link to={`/profile/${c.userId?._id}`}>
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {c.userId?.studentId?.name?.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <Link to={`/profile/${c.userId?._id}`} className="font-semibold text-sm hover:text-primary-600">
                      {c.userId?.studentId?.name}
                    </Link>
                    <p className="text-gray-800 text-sm">{c.content}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1 px-4">
                    <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                    {(c.userId?._id === user?.id || isOwner) && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;



