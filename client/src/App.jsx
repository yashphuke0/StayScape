import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalFlashMessage from './components/FlashMessage';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import ListingsIndex from './pages/ListingsIndex';
import ListingShow from './pages/ListingShow';
import ListingNew from './pages/ListingNew';
import ListingEdit from './pages/ListingEdit';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <GlobalFlashMessage />
        <Routes>
          {/* Redirect root to listings */}
          <Route path="/" element={<Navigate to="/listings" replace />} />
          
          {/* Public Routes */}
          <Route path="/listings" element={<ListingsIndex />} />
          <Route path="/listings/:id" element={<ListingShow />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route 
            path="/listings/new" 
            element={
              <ProtectedRoute>
                <ListingNew />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/listings/:id/edit" 
            element={
              <ProtectedRoute>
                <ListingEdit />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/listings" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
