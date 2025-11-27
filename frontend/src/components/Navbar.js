import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUser, FiSearch, FiSettings, FiLogOut, FiInfo } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isAdmin = user?.student?.rollNumber?.startsWith('ADMIN');

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">CampusCircle</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                isActive('/') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <FiHome className="text-xl" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to={`/profile/${user?.id}`}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                isActive(`/profile/${user?.id}`) ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <FiUser className="text-xl" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                  isActive('/admin') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <MdAdminPanelSettings className="text-xl" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            <Link
              to="/made-by"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                isActive('/made-by') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <FiInfo className="text-xl" />
              <span className="hidden sm:inline">About</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
            >
              <FiLogOut className="text-xl" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



