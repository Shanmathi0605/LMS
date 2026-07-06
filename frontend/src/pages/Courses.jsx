import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import CoursePreviewModal from '../components/CoursePreviewModal';
import LoginPromptModal from '../components/LoginPromptModal';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;
        if (!token) return;
        const { data } = await axios.get('http://localhost:5000/api/users/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(data.map(c => c._id || c));
      } catch (err) {
        console.error('Error fetching wishlist', err);
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (e, courseId) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const isSaved = wishlist.includes(courseId);
      if (isSaved) {
        await axios.delete(`http://localhost:5000/api/users/wishlist/${courseId}`, config);
        setWishlist(wishlist.filter(id => id !== courseId));
      } else {
        await axios.post(`http://localhost:5000/api/users/wishlist/${courseId}`, {}, config);
        setWishlist([...wishlist, courseId]);
      }
    } catch (err) {
      console.error('Error toggling wishlist', err);
    }
  };

  const fetchCourses = async () => {
    // setLoading(true); // removed to prevent UI jumping during search
    try {
      const queryParams = new URLSearchParams(location.search);
      const category = queryParams.get('category');
      
      let url = 'http://localhost:5000/api/courses?';
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      
      const { data } = await axios.get(url);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <span key={i} className="bg-yellow-200 dark:bg-yellow-600/50 text-slate-900 dark:text-white rounded-sm">{part}</span> 
        : part
    );
  };

  // if (loading && courses.length === 0) return <div className="text-center mt-20">Loading courses...</div>;

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              {category ? (
                <Link to="/categories" className="ml-1 hover:text-primary-600 dark:hover:text-primary-400 md:ml-2 transition-colors">Categories</Link>
              ) : (
                <span className="ml-1 text-gray-700 dark:text-gray-300 md:ml-2 font-medium">Courses</span>
              )}
            </div>
          </li>
          {category && (
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                <span className="ml-1 text-gray-700 dark:text-gray-300 md:ml-2 font-medium">{category}</span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white">
            {category ? `${category} Courses` : 'All Courses'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            {category ? `Explore top-rated courses in ${category}.` : 'Discover your next skill from our extensive catalog.'}
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex max-w-md w-full">
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="input-field rounded-r-none border-r-0 focus:ring-0 flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 font-bold rounded-r-xl shadow-md transition-colors">
            Search
          </button>
        </form>
      </div>
      
      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-gray-500">No courses available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div 
              key={course._id} 
              className="card p-4 hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1"
              onClick={() => {
                setSelectedCourse(course);
                setIsModalOpen(true);
              }}
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                   <span className="text-white font-bold bg-primary-600 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                     <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
                     Preview Course
                   </span>
                </div>
                {course.thumbnail !== 'no-photo.jpg' ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">{highlightText(course.title, searchQuery)}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary-600 font-bold">₹{course.price}</span>
                <div className="flex items-center gap-3">
                  <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">{course.category}</span>
                  <button onClick={(e) => toggleWishlist(e, course._id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Add to Wishlist">
                    {wishlist.includes(course._id) ? (
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CoursePreviewModal 
        course={selectedCourse} 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          // Small delay before clearing selected course to allow exit animation if we add one
          setTimeout(() => setSelectedCourse(null), 300);
        }} 
      />

      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        message="Please log in to add courses to your wishlist."
      />
    </div>
  );
};

export default Courses;
