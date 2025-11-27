import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI, postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { FiEdit2, FiUserPlus, FiUserCheck } from 'react-icons/fi';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      if (isOwnProfile) {
        setProfile(currentUser);
        setBio(currentUser.bio || '');
        setProfileImage(currentUser.student?.profileImage || '');
      } else {
        const response = await usersAPI.getProfile(userId);
        setProfile(response.data);
        setIsFollowing(response.data.isFollowing);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await postsAPI.getUserPosts(userId);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await usersAPI.updateProfile({ bio, profileImage });
      updateUser(response.data);
      setProfile(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleFollow = async () => {
    try {
      const response = await usersAPI.followUser(userId);
      setIsFollowing(response.data.isFollowing);
      setProfile({
        ...profile,
        followersCount: response.data.followersCount
      });
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-5xl flex-shrink-0">
              {profile.student?.name?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.student?.name}</h1>
                  <p className="text-gray-600 text-lg">@{profile.username}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-700">
                      <span className="font-semibold">Roll Number:</span> {profile.student?.rollNumber}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Department:</span> {profile.student?.department}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Batch:</span> {profile.student?.batch}
                    </p>
                  </div>
                </div>

                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <FiEdit2 />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {isFollowing ? <FiUserCheck /> : <FiUserPlus />}
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-6 mt-4">
                <div>
                  <span className="font-bold text-lg">{posts.length}</span>
                  <span className="text-gray-600 ml-1">Posts</span>
                </div>
                <div>
                  <span className="font-bold text-lg">{profile.followersCount || 0}</span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-lg">{profile.followingCount || 0}</span>
                  <span className="text-gray-600 ml-1">Following</span>
                </div>
              </div>

              {!isEditing && profile.bio && (
                <p className="mt-4 text-gray-700">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleUpdateProfile} className="mt-6 pt-6 border-t border-gray-200">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="4"
                  maxLength="500"
                />
                <p className="text-sm text-gray-500 mt-1">{bio.length}/500 characters</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Profile Image URL</label>
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Posts</h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No posts yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={handlePostDeleted}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;



