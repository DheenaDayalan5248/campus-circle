import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      searchUsers();
    }
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.searchUsers(query);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Search Results for "{query}"
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((user) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {user.student?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{user.student?.name}</h3>
                    <p className="text-gray-600">@{user.username}</p>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Roll:</span> {user.student?.rollNumber}
                      </p>
                      <p className="text-sm text-gray-700">
                        {user.student?.department} • {user.student?.batch}
                      </p>
                    </div>
                    {user.bio && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;



