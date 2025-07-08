import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingsAPI } from '../services/api';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allListings, setAllListings] = useState([]);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setSuggestions([]);
      setIsMenuOpen(false); // Close mobile menu if open
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch all listings on component mount
  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const response = await listingsAPI.getAll();
        setAllListings(response.data.data);
      } catch (error) {
        console.error('Error fetching listings for suggestions:', error);
      }
    };
    fetchAllListings();
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length > 1) {
        const filteredSuggestions = allListings
          .filter(listing => 
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5) // Limit to 5 suggestions
          .map(listing => ({
            id: listing._id,
            title: listing.title,
            location: listing.location
          }));
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, allListings]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInSearch = 
        (searchRef.current && searchRef.current.contains(event.target)) ||
        (suggestionsRef.current && suggestionsRef.current.contains(event.target)) ||
        (mobileSearchRef.current && mobileSearchRef.current.contains(event.target)) ||
        (mobileSuggestionsRef.current && mobileSuggestionsRef.current.contains(event.target));
      
      if (!isClickInSearch) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    setIsMenuOpen(false); // Close mobile menu if open
    navigate(`/listings?search=${encodeURIComponent(suggestion.title)}`);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <style>
        {`
          .modern-navbar {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-bottom: 1px solid #e9ecef;
            box-shadow: 0 2px 20px rgba(0,0,0,0.08);
            position: sticky;
            top: 0;
            z-index: 1000;
            padding: 1rem 0;
          }

          .navbar-brand-modern {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--text-primary);
            text-decoration: none;
            transition: all var(--transition-fast);
          }

          .navbar-brand-modern:hover {
            color: var(--primary-color);
            transform: scale(1.05);
          }

          .brand-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white !important;
            font-size: 1.2rem;
          }
          
          .brand-icon i {
            color: white !important;
          }

          .search-container {
            position: relative;
            max-width: 400px;
            width: 100%;
          }

          .search-form {
            position: relative;
            width: 100%;
          }

          .search-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 3rem;
            border: 2px solid #e9ecef;
            border-radius: 2rem;
            font-size: 1rem;
            transition: all var(--transition-fast);
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }

          .search-input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(254, 66, 77, 0.25);
            outline: none;
          }

          .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 1.1rem;
          }

          .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            margin-top: 0.5rem;
            max-height: 300px;
            overflow-y: auto;
          }

          .suggestion-item {
            padding: 0.75rem 1rem;
            cursor: pointer;
            border-bottom: 1px solid #f8f9fa;
            transition: background-color 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .suggestion-item:hover {
            background-color: #f8f9fa;
          }

          .suggestion-item:last-child {
            border-bottom: none;
          }

          .suggestion-icon {
            color: var(--text-muted);
            font-size: 0.875rem;
            width: 16px;
            text-align: center;
          }

          .suggestion-text {
            flex: 1;
          }

          .suggestion-title {
            font-weight: 500;
            color: var(--text-primary);
            margin: 0;
            font-size: 0.9rem;
          }

          .suggestion-location {
            font-size: 0.8rem;
            color: var(--text-muted);
            margin: 0;
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .nav-link-modern {
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-weight: 600;
            text-decoration: none;
            color: var(--text-primary);
            transition: all var(--transition-fast);
            border: 2px solid transparent;
          }

          .nav-link-modern:hover {
            color: var(--primary-color);
            background: rgba(254, 66, 77, 0.1);
            border-color: rgba(254, 66, 77, 0.2);
          }

          .user-menu {
            position: relative;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-fast);
            border: 2px solid transparent;
          }

          .user-avatar:hover {
            border-color: var(--primary-color);
            box-shadow: 0 4px 12px rgba(254, 66, 77, 0.3);
          }

          .dropdown-menu-modern {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            border: 1px solid #e9ecef;
            padding: 0.5rem;
            min-width: 200px;
            z-index: 1000;
            margin-top: 0.5rem;
          }

          .dropdown-item-modern {
            display: block;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            color: var(--text-primary);
            text-decoration: none;
            transition: all var(--transition-fast);
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
          }

          .dropdown-item-modern:hover {
            background: var(--background-gray);
            color: var(--primary-color);
          }

          .mobile-menu-toggle {
            display: none;
            background: none;
            border: 2px solid #e9ecef;
            border-radius: 0.5rem;
            padding: 0.5rem;
            color: var(--text-primary);
            cursor: pointer;
            transition: all var(--transition-fast);
          }

          .mobile-menu-toggle:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
          }

          .mobile-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e9ecef;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            padding: 1rem;
            gap: 1rem;
            flex-direction: column;
          }

          .mobile-menu.show {
            display: flex;
          }

          @media (max-width: 992px) {
            .nav-links {
              display: none;
            }
            
            .mobile-menu-toggle {
              display: block;
            }
            
            .search-container {
              max-width: 300px;
            }
          }

          @media (max-width: 768px) {
            .modern-navbar {
              padding: 0.75rem 0;
            }
            
            .navbar-brand-modern {
              font-size: 1.5rem;
            }
            
            .brand-icon {
              width: 35px;
              height: 35px;
              font-size: 1rem;
            }
            
            .search-container {
              max-width: 250px;
            }
            
            .search-input {
              padding: 0.5rem 0.75rem 0.5rem 2.5rem;
            }
          }

          @media (max-width: 768px) {
            .search-suggestions {
              border-radius: 0.75rem;
              margin-top: 0.25rem;
            }
            
            .suggestion-item {
              padding: 0.5rem 0.75rem;
            }
            
            .suggestion-title {
              font-size: 0.85rem;
            }
            
            .suggestion-location {
              font-size: 0.75rem;
            }
          }

          @media (max-width: 576px) {
            .search-container {
              display: none;
            }
          }
        `}
      </style>

      <nav className="modern-navbar">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            {/* Brand */}
            <Link to="/" className="navbar-brand-modern">
              <div className="brand-icon">
                <i className="fas fa-compass"></i>
              </div>
              <span>StayScape</span>
            </Link>

            {/* Search Bar */}
            <div className="search-container d-none d-md-block" ref={searchRef}>
              <form onSubmit={handleSearch} className="search-form">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="search-input"
                  autoComplete="off"
                />
                
                {/* Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="search-suggestions" ref={suggestionsRef}>
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <i className="fas fa-map-marker-alt suggestion-icon"></i>
                        <div className="suggestion-text">
                          <p className="suggestion-title">{suggestion.title}</p>
                          <p className="suggestion-location">{suggestion.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Desktop Navigation Links */}
            <div className="nav-links">
              <Link to="/listings" className="nav-link-modern">
                <i className="fas fa-home me-1"></i>
                Explore
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/listings/new" className="nav-link-modern">
                    <i className="fas fa-plus me-1"></i>
                    Add Listing
                  </Link>
                  
                  <div className="user-menu">
                    <div 
                      className="user-avatar"
                      onClick={toggleMenu}
                      data-bs-toggle="dropdown"
                    >
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    
                    {isMenuOpen && (
                      <div className="dropdown-menu-modern">
                        <div className="dropdown-item-modern">
                          <strong>Hi, {user?.username}!</strong>
                        </div>
                        <hr className="my-1" />
                        <Link 
                          to="/profile" 
                          className="dropdown-item-modern"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <i className="fas fa-user me-2"></i>
                          Profile
                        </Link>
                        <Link 
                          to="/my-listings" 
                          className="dropdown-item-modern"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <i className="fas fa-list me-2"></i>
                          My Listings
                        </Link>
                        <Link 
                          to="/favorites" 
                          className="dropdown-item-modern"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <i className="fas fa-heart me-2"></i>
                          Favorites
                        </Link>
                        <hr className="my-1" />
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="dropdown-item-modern text-danger"
                        >
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link-modern">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login
                  </Link>
                  <Link to="/signup" className="nav-link-modern">
                    <i className="fas fa-user-plus me-1"></i>
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMenu}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`}>
            {/* Mobile Search */}
            <div className="d-md-none" ref={mobileSearchRef}>
              <form onSubmit={handleSearch} className="search-form">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="search-input"
                  autoComplete="off"
                />
                
                {/* Mobile Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="search-suggestions" ref={mobileSuggestionsRef}>
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <i className="fas fa-map-marker-alt suggestion-icon"></i>
                        <div className="suggestion-text">
                          <p className="suggestion-title">{suggestion.title}</p>
                          <p className="suggestion-location">{suggestion.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            <Link 
              to="/listings" 
              className="nav-link-modern"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-home me-2"></i>
              Explore
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/listings/new" 
                  className="nav-link-modern"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Listing
                </Link>
                <Link 
                  to="/profile" 
                  className="nav-link-modern"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-user me-2"></i>
                  Profile
                </Link>
                <Link 
                  to="/my-listings" 
                  className="nav-link-modern"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-list me-2"></i>
                  My Listings
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="nav-link-modern text-danger"
                  style={{ border: 'none', background: 'none' }}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link-modern"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="nav-link-modern"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar; 