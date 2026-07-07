import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;
        if (!token) {
          setLoading(false);
          return;
        }
        
        const { data } = await axios.get('https://lms-dg3c.onrender.com/api/users/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistCourses(data);
      } catch (err) {
        console.error('Error fetching wishlist', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const removeFromWishlist = async (courseId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`https://lms-dg3c.onrender.com/api/users/wishlist/${courseId}`, config);
      setWishlistCourses(wishlistCourses.filter(c => c._id !== courseId));
    } catch (err) {
      console.error('Error removing from wishlist', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading your wishlist...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Wishlist</h2>
        <p className="text-gray-600 mb-8">Please login to view your saved courses.</p>
        <Link to="/login" className="btn-primary">Login Now</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">My Wishlist</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Courses you have saved for later.</p>
      
      {wishlistCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Explore our courses and find something you love!</p>
          <Link to="/courses" className="btn-primary inline-block">Explore Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistCourses.map(course => (
            <div key={course._id} className="card p-4 hover:shadow-lg transition-shadow relative">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">{course.description}</p>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-primary-600 font-bold">₹{Math.round(course.price)}</span>
                <button 
                  onClick={() => removeFromWishlist(course._id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
