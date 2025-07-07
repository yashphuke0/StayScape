import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import FlashMessage from '../components/FlashMessage';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const ListingShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getById(id);
      setListing(response.data.listing);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await listingsAPI.delete(id);
        setSuccess('Listing deleted successfully');
        setTimeout(() => navigate('/listings'), 1500);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to delete listing');
      }
    }
  };

  const handleReviewUpdate = () => {
    fetchListing(); // Refresh to show updated reviews
  };

  if (loading) return <LoadingSpinner />;

  if (!listing) {
    return (
      <div className="listing-not-found">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="error-card p-5">
                <i className="fas fa-home fa-3x text-muted mb-3"></i>
                <h2 className="mb-3">Listing Not Found</h2>
                <p className="text-muted mb-4">The listing you're looking for doesn't exist or has been removed.</p>
                <Link to="/listings" className="btn btn-primary">
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && listing.owner._id === user._id;

  return (
    <div className="listing-show-page fade-in">
      <style>
        {`
          .listing-show-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }

          .listing-hero {
            background: white;
            border-radius: 0 0 2rem 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
          }

          .listing-image-container {
            position: relative;
            overflow: hidden;
            border-radius: 1.5rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            margin-bottom: 2rem;
          }

          .listing-main-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .listing-main-image:hover {
            transform: scale(1.02);
          }

          .listing-info-card {
            background: white;
            border-radius: 1.5rem;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #f1f3f5;
          }

          .listing-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1d3557;
            margin-bottom: 1rem;
            line-height: 1.2;
          }

          .listing-owner {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 1rem;
            margin-bottom: 1.5rem;
            border-left: 4px solid var(--primary-color);
          }

          .owner-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
          }

          .listing-price {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
            margin: 1.5rem 0;
          }

          .listing-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
          }

          .detail-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 0.75rem;
            border: 1px solid #e9ecef;
          }

          .detail-icon {
            width: 20px;
            color: var(--primary-color);
          }

          .action-buttons {
            display: flex;
            gap: 1rem;
            margin: 2rem 0;
            flex-wrap: wrap;
          }

          .reviews-section {
            background: white;
            border-radius: 1.5rem;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            margin: 2rem 0;
          }

          .map-section {
            background: white;
            border-radius: 1.5rem;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            margin: 2rem 0;
          }

          .map-placeholder {
            height: 400px;
            background: linear-gradient(135deg, #e9ecef, #f8f9fa);
            border: 2px dashed #dee2e6;
            border-radius: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #6c757d;
            font-size: 1.1rem;
          }

          .error-card {
            background: white;
            border-radius: 1.5rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }

          @media (max-width: 768px) {
            .listing-title {
              font-size: 2rem;
            }
            
            .listing-main-image {
              height: 300px;
            }
            
            .listing-info-card {
              padding: 1.5rem;
            }
            
            .action-buttons {
              flex-direction: column;
            }
            
            .action-buttons .btn {
              width: 100%;
            }
          }
        `}
      </style>

      <div className="container py-4">
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="listing-hero">
              <div className="listing-image-container">
                <img
                  src={listing.image.url}
                  className="listing-main-image"
                  alt={listing.title}
                />
              </div>
            </div>

            <div className="listing-info-card">
              <h1 className="listing-title">{listing.title}</h1>
              
              <div className="listing-owner">
                <div className="owner-avatar">
                  {listing.owner.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>Hosted by {listing.owner.username}</strong>
                  <div className="small text-muted">Property Owner</div>
                </div>
              </div>

              <div className="listing-price">
                ₹{listing.price.toLocaleString("en-IN")} <span className="fs-5 text-muted">/ night</span>
              </div>

              <div className="listing-details">
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt detail-icon"></i>
                  <div>
                    <strong>Location</strong>
                    <div className="small text-muted">{listing.location}</div>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-globe detail-icon"></i>
                  <div>
                    <strong>Country</strong>
                    <div className="small text-muted">{listing.country}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="mb-3">About this place</h4>
                <p className="fs-6 lh-lg">{listing.description}</p>
              </div>

              {isOwner && (
                <div className="action-buttons">
                  <Link
                    to={`/listings/${listing._id}/edit`}
                    className="btn btn-outline-primary"
                  >
                    <i className="fas fa-edit me-2"></i>
                    Edit Listing
                  </Link>
                  <button 
                    className="btn btn-outline-danger" 
                    onClick={handleDeleteListing}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Delete Listing
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Map Section */}
            <div className="map-section">
              <h4 className="mb-3">
                <i className="fas fa-map-marked-alt me-2 text-primary"></i>
                Where you'll be
              </h4>
              <div className="map-placeholder">
                <i className="fas fa-map fa-2x mb-2"></i>
                <div className="text-center">
                  <strong>{listing.location}</strong>
                  <div className="small">{listing.country}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {!isOwner && (
              <div className="listing-info-card">
                <h5 className="mb-3">Interested in this place?</h5>
                <div className="d-grid gap-2">
                  <button className="btn btn-primary">
                    <i className="fas fa-heart me-2"></i>
                    Save to Wishlist
                  </button>
                  <button className="btn btn-outline-primary">
                    <i className="fas fa-share me-2"></i>
                    Share Listing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Flash Messages */}
        {error && <FlashMessage message={error} type="error" />}
        {success && <FlashMessage message={success} type="success" />}

        {/* Reviews Section */}
        <div className="row">
          <div className="col-12">
            <div className="reviews-section">
              <ReviewForm 
                listingId={id} 
                onReviewAdded={handleReviewUpdate} 
              />
              
              <ReviewList 
                reviews={listing.reviews} 
                listingId={id}
                onReviewDeleted={handleReviewUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingShow; 