import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import SinglePost from './pages/SinglePost';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';
import MadeBy from './pages/MadeBy';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/post/:postId"
            element={
              <ProtectedRoute>
                <SinglePost />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/made-by"
            element={
              <ProtectedRoute>
                <MadeBy />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;



