import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaUser, FaCheckCircle } from 'react-icons/fa';
//import './ReviewsSection.css';

const ReviewsSection = ({ productId, reviews, setReviews, isAuthenticated }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchReviews();
    checkIfUserHasReviewed();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/product/${productId}`);
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkIfUserHasReviewed = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch(`/api/reviews/product/${productId}/user-has-reviewed`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHasReviewed(data.hasReviewed);
      }
    } catch (error) {
      console.error('Error checking if user has reviewed:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId,
          rating,
          comment
        })
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([...reviews, newReview]);
        setRating(0);
        setComment('');
        setHasReviewed(true);
        alert('Review submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="star full" />);
      } else {
        stars.push(<FaRegStar key={i} className="star empty" />);
      }
    }
    return stars;
  };

  return (
    <div className="reviews-section">
      <h3>Customer Reviews</h3>
      
      {!hasReviewed && isAuthenticated && (
        <div className="review-form">
          <h4>Write a Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="rating-input">
              <label>Rating:</label>
              <div className="stars-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= rating ? 'selected' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    {star <= rating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="comment-input">
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting || rating === 0}
              className="submit-review-btn"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
      
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="user-info">
                  <FaUser className="user-icon" />
                  <span className="user-name">{review.userName || 'Anonymous'}</span>
                  {review.isVerifiedPurchase && (
                    <span className="verified-badge">
                      <FaCheckCircle /> Verified Purchase
                    </span>
                  )}
                </div>
                <div className="review-date">
                  {new Date(review.reviewDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
              
              <div className="review-comment">
                {review.comment}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;