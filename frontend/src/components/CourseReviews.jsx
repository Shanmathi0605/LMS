import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';

const CourseReviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/courses/${courseId}/reviews`);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to submit a review');
      return;
    }
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/reviews`,
        { rating, comment },
        config
      );
      
      setComment('');
      setRating(5);
      setError('');
      fetchReviews(); // Refresh reviews
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading reviews...</div>;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="font-semibold text-lg mb-4 dark:text-white flex items-center gap-2">
        Student Reviews 
        {reviews.length > 0 && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <FaStar /> {averageRating} ({reviews.length})
          </span>
        )}
      </h3>

      {/* Review Form */}
      {user && (
        <form onSubmit={submitReview} className="mb-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Write a Review</h4>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-slate-600 dark:text-slate-400">Rating:</span>
            {[1, 2, 3, 4, 5].map(num => (
              <button 
                key={num} 
                type="button" 
                onClick={() => setRating(num)}
                className={`text-xl ${num <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="What did you think about this course?"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white mb-3"
            rows="3"
          ></textarea>
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Submit Review
          </button>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm dark:text-white">{review.user?.name || 'Anonymous'}</span>
                <div className="flex text-yellow-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseReviews;
