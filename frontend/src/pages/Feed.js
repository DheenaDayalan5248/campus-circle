import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getFeed(page);
      setPosts(response.data.posts);
      setHasMore(response.data.currentPage < response.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const response = await postsAPI.getFeed(nextPage);
      setPosts([...posts, ...response.data.posts]);
      setPage(nextPage);
      setHasMore(response.data.currentPage < response.data.totalPages);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <CreatePost onPostCreated={handlePostCreated} />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={handlePostDeleted}
              />
            ))}

            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;



