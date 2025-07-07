import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../services/api';
import FlashMessage from './FlashMessage';

const ReviewForm = ({ listingId, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      await reviewsAPI.create(listingId, { rating, comment });
      setSuccess('Review added successfully!');
      setRating(1);
      setComment('');
      if (onReviewAdded) onReviewAdded();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoveredRating(value);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  if (!user) {
    return (
      <div className="review-form-container">
        <style>
          {`
            .review-form-container {
              background: linear-gradient(135deg, #f8f9fa, #e9ecef);
              border: 2px dashed #dee2e6;
              border-radius: 1.5rem;
              padding: 2rem;
              text-align: center;
              margin: 2rem 0;
            }

            .login-prompt {
              color: var(--text-secondary);
              font-size: 1.1rem;
              margin-bottom: 1rem;
            }

            .login-icon {
              font-size: 2rem;
              color: var(--text-muted);
              margin-bottom: 1rem;
            }
          `}
        </style>
        
        <div className="login-icon">
          <i className="fas fa-comment-dots"></i>
        </div>
        <p className="login-prompt">Please log in to leave a review</p>
        <a href="/login" className="btn btn-primary">
          <i className="fas fa-sign-in-alt me-2"></i>
          Login to Review
        </a>
      </div>
    );
  }

  return (
    <div className="review-form-section">
      <style>
        {`
          .review-form-section {
            background: white;
            border-radius: 1.5rem;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #f1f3f5;
            margin: 2rem 0;
          }

          .review-form-title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
          }

          .review-form-title i {
            color: var(--primary-color);
          }

          .rating-section {
            margin-bottom: 1.5rem;
          }

          .rating-label {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
            display: block;
          }

          .star-rating {
            display: flex;
            gap: 0.25rem;
            margin-bottom: 0.5rem;
          }

          .star {
            font-size: 2rem;
            cursor: pointer;
            transition: all var(--transition-fast);
            color: #ddd;
          }

          .star.filled {
            color: #ffc107;
          }

          .star.hovered {
            color: #ffc107;
            transform: scale(1.1);
          }

          .star:hover {
            transform: scale(1.2);
          }

          .rating-text {
            font-size: 0.875rem;
            color: var(--text-muted);
            font-style: italic;
          }

          .comment-section {
            margin-bottom: 1.5rem;
          }

          .comment-label {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
            display: block;
          }

          .comment-textarea {
            width: 100%;
            min-height: 120px;
            padding: 1rem;
            border: 2px solid var(--border-color);
            border-radius: var(--border-radius-md);
            font-family: inherit;
            font-size: 1rem;
            line-height: 1.5;
            resize: vertical;
            transition: all var(--transition-fast);
          }

          .comment-textarea:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(254, 66, 77, 0.25);
            outline: none;
          }

          .comment-textarea::placeholder {
            color: var(--text-muted);
          }

          .submit-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
          }

          .character-count {
            font-size: 0.875rem;
            color: var(--text-muted);
          }

          .submit-btn {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
            border: none;
            border-radius: var(--border-radius-md);
            padding: 0.75rem 2rem;
            color: white;
            font-weight: 600;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 2px 8px rgba(254, 66, 77, 0.3);
          }

          .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(254, 66, 77, 0.4);
          }

          .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          @media (max-width: 768px) {
            .review-form-section {
              padding: 1.5rem;
            }

            .submit-section {
              flex-direction: column;
              align-items: stretch;
            }

            .submit-btn {
              width: 100%;
              justify-content: center;
            }

            .star-rating {
              justify-content: center;
            }
          }
        `}
      </style>

      <div className="review-form-title">
        <i className="fas fa-star-half-alt"></i>
        Leave a Review
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rating-section">
          <label className="rating-label">Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={`star ${
                  value <= (hoveredRating || rating) ? 'filled' : ''
                } ${hoveredRating === value ? 'hovered' : ''}`}
                onClick={() => handleStarClick(value)}
                onMouseEnter={() => handleStarHover(value)}
                onMouseLeave={handleStarLeave}
              >
                <i className="fas fa-star"></i>
              </span>
            ))}
          </div>
          <div className="rating-text">
            {rating === 1 && "Poor - Not recommended"}
            {rating === 2 && "Fair - Below expectations"}
            {rating === 3 && "Good - Met expectations"}
            {rating === 4 && "Very Good - Exceeded expectations"}
            {rating === 5 && "Excellent - Outstanding experience"}
          </div>
        </div>

        <div className="comment-section">
          <label className="comment-label">Your Review</label>
          <textarea
            className="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience... What did you like most? Any tips for future guests?"
            required
            maxLength={1000}
          />
        </div>

        <div className="submit-section">
          <div className="character-count">
            {comment.length}/1000 characters
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !comment.trim()}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Posting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Post Review
              </>
            )}
          </button>
        </div>
      </form>

      {error && <FlashMessage message={error} type="error" />}
      {success && <FlashMessage message={success} type="success" />}
    </div>
  );
};

export default ReviewForm; 