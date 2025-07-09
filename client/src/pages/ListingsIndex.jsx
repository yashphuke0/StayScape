import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { listingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ListingsIndex = () => {
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTax, setShowTax] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [location.search]);

  // Apply filters when selectedFilter changes (but not on initial load)
  useEffect(() => {
    if (allListings.length > 0) {
      applyFilters(allListings, searchQuery, selectedFilter);
    }
  }, [selectedFilter]);

  const fetchListings = async () => {
    try {
      // Extract search query and filter from URL
      const urlParams = new URLSearchParams(location.search);
      const currentSearchQuery = urlParams.get('search');
      const currentFilter = urlParams.get('filter') || 'all';
      
      setSearchQuery(currentSearchQuery || '');
      setSelectedFilter(currentFilter);
      
      // Try to get all listings first
      const response = await listingsAPI.getAll();
      const allData = response.data.data;
      setAllListings(allData);
      
      // Apply filters and search
      applyFilters(allData, currentSearchQuery, currentFilter);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data, searchTerm, filter) => {
    let filteredData = [...data];

    // Apply category filter first
    if (filter && filter !== 'all') {
      filteredData = filteredData.filter(listing => {
        const title = listing.title.toLowerCase();
        const location = listing.location.toLowerCase();
        const description = listing.description?.toLowerCase() || '';
        
        switch (filter) {
          case 'hotels':
            return title.includes('hotel') || title.includes('resort') || description.includes('hotel');
          case 'beach':
            return title.includes('beach') || location.includes('beach') || description.includes('beach') || location.includes('coastal');
          case 'mountains':
            return title.includes('mountain') || location.includes('mountain') || description.includes('mountain') || title.includes('hill');
          case 'city':
            return location.includes('city') || title.includes('apartment') || title.includes('downtown') || title.includes('urban');
          default:
            return true;
        }
      });
    }

    // Apply search filter if exists
    if (searchTerm) {
      filteredData = filteredData.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setListings(filteredData);
  };

  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    applyFilters(allListings, searchQuery, filterType);
    
    // Update URL to include filter parameter
    const urlParams = new URLSearchParams(location.search);
    if (filterType === 'all') {
      urlParams.delete('filter');
    } else {
      urlParams.set('filter', filterType);
    }
    
    const newSearch = urlParams.toString();
    const newPath = newSearch ? `/listings?${newSearch}` : '/listings';
    navigate(newPath, { replace: true });
  };

  const handleTaxToggle = () => {
    setShowTax(!showTax);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="listings-index-page fade-in">
      <style>
        {`
          .listings-index-page {
            min-height: 100vh;
            background: #ffffff;
          }

          .filters-container {
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            margin-bottom: 2rem;
            padding: 1rem 0;
          }

          .filters-scroll {
            display: flex;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 0 1rem;
            gap: 1rem;
          }

          .filters-scroll::-webkit-scrollbar {
            display: none;
          }

          .filter-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 80px;
            padding: 0.75rem 0.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            border: 1px solid transparent;
            background: white;
            transition: all 0.2s ease;
          }

          .filter-item:hover {
            opacity: 0.7;
            transform: translateY(-1px);
          }

          .filter-item.active {
            background: var(--primary-color);
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(254, 66, 77, 0.3);
          }

          .filter-item.active i {
            color: white !important;
          }

          .filter-item.active p {
            color: white !important;
            font-weight: 600;
          }

          .filter-item i {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
            color: #6c757d;
          }

          .filter-item p {
            font-size: 0.8rem;
            font-weight: 500;
            margin: 0;
            text-align: center;
            color: #495057;
          }

          .tax-toggle-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            margin-right: 1rem;
          }

          .tax-toggle {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: border-color 0.2s ease;
          }

          .tax-toggle:hover {
            border-color: var(--primary-color);
          }

          .tax-toggle input:checked + .form-check-label {
            color: var(--primary-color);
            font-weight: 500;
          }

          .listings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            padding: 0;
          }

          .listing-card {
            background: white;
            border-radius: 1.5rem;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: all var(--transition-medium);
            border: 1px solid #f1f3f5;
            text-decoration: none;
            color: inherit;
          }

          .listing-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
            color: inherit;
          }

          .listing-image-wrapper {
            position: relative;
            overflow: hidden;
            height: 240px;
          }

          .listing-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform var(--transition-medium);
          }

          .listing-card:hover .listing-image {
            transform: scale(1.1);
          }

          .listing-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);
            opacity: 0;
            transition: opacity var(--transition-fast);
          }

          .listing-card:hover .listing-overlay {
            opacity: 1;
          }

          .listing-content {
            padding: 1.5rem;
          }

          .listing-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: var(--text-primary);
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .listing-price {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--primary-color);
            margin: 0;
          }

          .tax-info {
            font-size: 0.875rem;
            color: var(--text-muted);
            font-weight: normal;
          }

          .search-results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            margin-bottom: 1rem;
            border-bottom: 1px solid #e9ecef;
          }

          .search-results-header h5 {
            margin: 0;
            color: var(--text-primary);
            font-weight: 600;
          }

          .clear-search-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #f8f9fa;
            color: var(--text-muted);
            text-decoration: none;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.2s ease;
          }

          .clear-search-btn:hover {
            background: var(--primary-color);
            color: white;
            text-decoration: none;
          }

          .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            background: white;
            border-radius: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            margin: 2rem 1rem;
          }

          @media (max-width: 768px) {
            .listings-grid {
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 1.5rem;
            }
            
            .filter-item {
              min-width: 65px;
              padding: 0.5rem 0.25rem;
            }
            
            .filter-item i {
              font-size: 1rem;
            }
            
            .filter-item p {
              font-size: 0.7rem;
            }
            
            .tax-toggle {
              padding: 0.5rem 0.75rem;
              margin: 0.5rem;
            }

            .search-results-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75rem;
            }

            .search-results-header h5 {
              font-size: 1rem;
            }

            .filter-item.active {
              transform: translateY(-1px);
              box-shadow: 0 2px 8px rgba(254, 66, 77, 0.3);
            }
          }

          @media (max-width: 576px) {
            .listings-grid {
              grid-template-columns: 1fr;
              padding: 0;
            }
          }
        `}
      </style>

      <div className="container-fluid px-0">
        {/* Filters Section */}
        <div className="filters-container">
          <div className="d-flex align-items-center px-3">
            <div className="filters-scroll flex-grow-1">
              <div 
                className={`filter-item ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                <i className="fas fa-home"></i>
                <p>All</p>
              </div>
              <div 
                className={`filter-item ${selectedFilter === 'hotels' ? 'active' : ''}`}
                onClick={() => handleFilterChange('hotels')}
              >
                <i className="fas fa-hotel"></i>
                <p>Hotels</p>
              </div>
              <div 
                className={`filter-item ${selectedFilter === 'beach' ? 'active' : ''}`}
                onClick={() => handleFilterChange('beach')}
              >
                <i className="fas fa-umbrella-beach"></i>
                <p>Beach</p>
              </div>
              <div 
                className={`filter-item ${selectedFilter === 'mountains' ? 'active' : ''}`}
                onClick={() => handleFilterChange('mountains')}
              >
                <i className="fas fa-mountain-sun"></i>
                <p>Mountains</p>
              </div>
              <div 
                className={`filter-item ${selectedFilter === 'city' ? 'active' : ''}`}
                onClick={() => handleFilterChange('city')}
              >
                <i className="fas fa-building"></i>
                <p>City</p>
              </div>
            </div>

            <div className="tax-toggle-container">
              <div className="tax-toggle">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="taxSwitch"
                    checked={showTax}
                    onChange={handleTaxToggle}
                  />
                  <label className="form-check-label" htmlFor="taxSwitch">
                    Display total after taxes
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Header */}
        {(searchQuery || selectedFilter !== 'all') && (
          <div className="container-fluid px-3">
            <div className="search-results-header">
              <h5>
                {listings.length} result{listings.length !== 1 ? 's' : ''} 
                {searchQuery && ` for "${searchQuery}"`}
                {selectedFilter !== 'all' && ` in ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}`}
              </h5>
              <div className="d-flex gap-2">
                {searchQuery && (
                  <Link to="/listings" className="clear-search-btn">
                    <i className="fas fa-times"></i> Clear search
                  </Link>
                )}
                {selectedFilter !== 'all' && (
                  <button 
                    onClick={() => handleFilterChange('all')}
                    className="clear-search-btn"
                    style={{ border: 'none' }}
                  >
                    <i className="fas fa-times"></i> Clear filter
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        <div className="container-fluid px-3">
          {listings.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-home fa-3x text-muted mb-3"></i>
              <h3 className="mb-3">
                {searchQuery 
                  ? `No results found for "${searchQuery}"` 
                  : selectedFilter !== 'all' 
                    ? `No ${selectedFilter} listings found`
                    : "No listings found"
                }
              </h3>
              <p className="text-muted">
                {searchQuery 
                  ? "Try a different search term or check your spelling." 
                  : selectedFilter !== 'all'
                    ? `Try selecting a different category or clear the current filter.`
                    : "Check back later for new listings or try adjusting your filters."
                }
              </p>
              {(searchQuery || selectedFilter !== 'all') && (
                <button 
                  onClick={() => {
                    handleFilterChange('all');
                    // Clear search if there's one
                    if (searchQuery) {
                      window.location.href = '/listings';
                    }
                  }}
                  className="btn btn-primary mt-3"
                >
                  Show All Listings
                </button>
              )}
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <Link 
                  key={listing._id} 
                  to={`/listings/${listing._id}`} 
                  className="listing-card"
                >
                  <div className="listing-image-wrapper">
                    <img
                      src={listing.image.url}
                      className="listing-image"
                      alt={listing.title}
                    />
                    <div className="listing-overlay"></div>
                  </div>
                  
                  <div className="listing-content">
                    <h3 className="listing-title">{listing.title}</h3>
                    <p className="listing-price">
                      ₹{listing.price.toLocaleString("en-IN")} / night
                      {showTax && <span className="tax-info"> + 18% GST</span>}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingsIndex; 