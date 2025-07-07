import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { listingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ListingsIndex = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTax, setShowTax] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchListings();
  }, [location.search]);

  const fetchListings = async () => {
    try {
      const response = await listingsAPI.getAll();
      setListings(response.data.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
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
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }

          .filters-container {
            background: white;
            border-radius: 0 0 2rem 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            margin-bottom: 2rem;
            padding: 1.5rem 0;
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
            padding: 1rem 0.75rem;
            border-radius: 1rem;
            transition: all var(--transition-fast);
            cursor: pointer;
            border: 2px solid transparent;
            background: #f8f9fa;
          }

          .filter-item:hover {
            background: var(--primary-color);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(254, 66, 77, 0.3);
          }

          .filter-item i {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }

          .filter-item p {
            font-size: 0.875rem;
            font-weight: 600;
            margin: 0;
            text-align: center;
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
            border: 2px solid var(--border-color);
            border-radius: 2rem;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all var(--transition-fast);
          }

          .tax-toggle:hover {
            border-color: var(--primary-color);
            box-shadow: 0 4px 12px rgba(254, 66, 77, 0.2);
          }

          .tax-toggle input:checked + .form-check-label {
            color: var(--primary-color);
            font-weight: 600;
          }

          .listings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            padding: 0 1rem;
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
              min-width: 70px;
              padding: 0.75rem 0.5rem;
            }
            
            .filter-item i {
              font-size: 1.25rem;
            }
            
            .filter-item p {
              font-size: 0.75rem;
            }
            
            .tax-toggle {
              padding: 0.75rem 1rem;
              margin: 1rem;
            }
          }

          @media (max-width: 576px) {
            .listings-grid {
              grid-template-columns: 1fr;
              padding: 0 0.5rem;
            }
          }
        `}
      </style>

      <div className="container-fluid px-0">
        {/* Filters Section */}
        <div className="filters-container">
          <div className="d-flex align-items-center">
            <div className="filters-scroll flex-grow-1">
              <div className="filter-item">
                <i className="fas fa-fire"></i>
                <p>Trending</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-bed"></i>
                <p>Rooms</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-mountain-city"></i>
                <p>Iconic cities</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-water-ladder"></i>
                <p>Pools</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-hotel"></i>
                <p>Hotels</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-umbrella-beach"></i>
                <p>Beach</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-mountain-sun"></i>
                <p>Mountains</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-fort-awesome"></i>
                <p>Castles</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-tents"></i>
                <p>Camping</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-sailboat"></i>
                <p>Boats</p>
              </div>
              <div className="filter-item">
                <i className="fas fa-kitchen-set"></i>
                <p>Kitchen</p>
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

        {/* Listings Grid */}
        <div className="container">
          {listings.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-home fa-3x text-muted mb-3"></i>
              <h3 className="mb-3">No listings found</h3>
              <p className="text-muted">Check back later for new listings or try adjusting your filters.</p>
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