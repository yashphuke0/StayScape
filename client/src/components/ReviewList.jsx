import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../services/api';
import FlashMessage from './FlashMessage';

const ReviewList = ({ reviews, listingId, onReviewDeleted }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      setLoading(true);
      setError('');
      await reviewsAPI.delete(listingId, reviewId);
      setSuccess('Review deleted successfully!');
      if (onReviewDeleted) onReviewDeleted();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'filled' : 'empty'}`}
      ></i>
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="reviews-section">
      <style>
        {`
          .reviews-section {
            background: white;
            border-radius: 1.5rem;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #f1f3f5;
            margin: 2rem 0;
          }

          .reviews-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f1f3f5;
          }

          .reviews-title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
          }

          .reviews-title i {
            color: var(--primary-color);
          }

          .reviews-summary {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            padding: 1rem 1.5rem;
            border-radius: 1rem;
            border-left: 4px solid var(--primary-color);
          }

          .average-rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary-color);
          }

          .rating-stars {
            display: flex;
            gap: 0.25rem;
          }

          .rating-stars .fa-star.filled {
            color: #ffc107;
          }

          .rating-stars .fa-star.empty {
            color: #ddd;
          }

          .reviews-count {
            font-size: 0.875rem;
            color: var(--text-muted);
          }

          .reviews-grid {
            display: grid;
            gap: 1.5rem;
          }

          .review-card {
            background: #f8f9fa;
            border-radius: 1rem;
            padding: 1.5rem;
            border: 1px solid #e9ecef;
            transition: all var(--transition-fast);
            position: relative;
          }

          .review-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            transform: translateY(-2px);
          }

          .review-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
          }

          .reviewer-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .reviewer-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 1.25rem;
            box-shadow: 0 2px 8px rgba(254, 66, 77, 0.3);
          }

          .reviewer-details h6 {
            margin: 0;
            font-weight: 600;
            color: var(--text-primary);
          }

          .review-date {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin: 0;
          }

          .review-rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .review-rating-stars {
            display: flex;
            gap: 0.125rem;
          }

          .review-rating-stars .fa-star {
            font-size: 1rem;
          }

          .review-rating-stars .fa-star.filled {
            color: #ffc107;
          }

          .review-rating-stars .fa-star.empty {
            color: #ddd;
          }

          .review-rating-number {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-secondary);
          }

          .review-comment {
            font-size: 1rem;
            line-height: 1.6;
            color: var(--text-secondary);
            margin-bottom: 1rem;
          }

          .review-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
          }

          .delete-btn {
            background: none;
            border: 1px solid #dc3545;
            color: #dc3545;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .delete-btn:hover {
            background: #dc3545;
            color: white;
          }

          .delete-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .no-reviews {
            text-align: center;
            padding: 3rem 2rem;
            color: var(--text-muted);
          }

          .no-reviews i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--text-muted);
          }

          .no-reviews h4 {
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
          }

          .no-reviews p {
            font-size: 1rem;
            margin: 0;
          }

          @media (max-width: 768px) {
            .reviews-section {
              padding: 1.5rem;
            }

            .reviews-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }

            .reviews-summary {
              width: 100%;
              justify-content: space-between;
            }

            .review-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75rem;
            }

            .reviewer-info {
              width: 100%;
            }

            .review-rating {
              width: 100%;
              justify-content: space-between;
            }
          }
        `}
      </style>

      <div className="reviews-header">
        <h3 className="reviews-title">
          <i className="fas fa-comments"></i>
          Reviews
        </h3>
        
        {reviews.length > 0 && (
          <div className="reviews-summary">
            <div className="average-rating">
              <div className="rating-stars">
                {renderStars(Math.round(getAverageRating()))}
              </div>
              <span>{getAverageRating()}</span>
            </div>
            <div className="reviews-count">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        )}
      </div>

      {error && <FlashMessage message={error} type="error" />}
      {success && <FlashMessage message={success} type="success" />}

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <i className="fas fa-comment-slash"></i>
          <h4>No reviews yet</h4>
          <p>Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.author.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="reviewer-details">
                    <h6>{review.author.username}</h6>
                    <p className="review-date">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                
                <div className="review-rating">
                  <div className="review-rating-stars">
                    {renderStars(review.rating)}
                  </div>
                  <span className="review-rating-number">
                    {review.rating}/5
                  </span>
                </div>
              </div>

              <p className="review-comment">{review.comment}</p>

              {user && review.author._id === user._id && (
                <div className="review-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteReview(review._id)}
                    disabled={loading}
                  >
                    <i className="fas fa-trash"></i>
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList; 