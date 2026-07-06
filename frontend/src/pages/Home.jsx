import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
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
      alert('Please login to save courses to your wishlist.');
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/courses');
        setFeaturedCourses(data.slice(0, 3)); // Get first 3 courses
      } catch (error) {
        console.error('Error fetching courses', error);
      }
    };
    fetchCourses();
  }, []);

  const handleEnrollClick = async (course) => {
    try {
      const token = localStorage.getItem('token');
      // If no token, maybe redirect to login or show alert (skipping for brevity)
      
      // Fetch Razorpay key
      const { data: config } = await axios.get('http://localhost:5000/api/payment/config');
      
      // 1. Create order on backend
      const { data: order } = await axios.post('http://localhost:5000/api/payment/orders', {
        amount: course.price,
        currency: 'USD',
        receipt: `receipt_${course._id}`
      });
      
      // 2. Open Razorpay Checkout
      const options = {
        key: config.key, // Dynamic key from backend
        amount: order.amount,
        currency: order.currency,
        name: 'SkillNova',
        description: `Enroll in ${course.title}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3176/3176369.png',
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await axios.post('http://localhost:5000/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if(verifyRes.data.success) {
              alert(`Successfully enrolled in ${course.title}!`);
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            alert('Error verifying payment.');
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#8b5cf6'
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        console.error(response.error);
        alert('Payment Failed!');
      });
      rzp1.open();
    } catch (error) {
      console.error('Error during payment', error);
      alert('Error initiating payment');
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 pr-0 md:pr-12 mb-12 md:mb-0 animate-fade-in-up">
            <div className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold rounded-full mb-6">
              🚀 Launch Your Tech Career Today
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Unlock Your Potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">SkillNova</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover a world of knowledge. Learn from industry experts, gain new skills, and advance your career with our interactive online courses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary text-lg px-8 py-4">Explore Courses</Link>
              <button onClick={() => setShowModal(true)} className="px-8 py-4 border-2 border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-surface transition-all font-semibold text-lg hover:-translate-y-1 bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm">View Plan Details</button>
            </div>
          </div>
          <div className="md:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-indigo-500 rounded-[2.5rem] transform rotate-3 scale-105 opacity-20 dark:opacity-40"></div>
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students learning" className="relative rounded-[2rem] shadow-2xl border-8 border-white/50 dark:border-dark-surface/50 backdrop-blur-sm object-cover h-[500px] w-full" />
            
            {/* Floating Badges */}
            <div className="absolute -left-8 top-20 card p-4 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">🏆</div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Top Rated</p>
                <p className="text-sm text-slate-500">Instructors</p>
              </div>
            </div>
            
            <div className="absolute -right-8 bottom-20 card p-4 flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">⭐</div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">4.9/5</p>
                <p className="text-sm text-slate-500">Student Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Trending Courses</h2>
              <p className="text-slate-600 dark:text-slate-400">Explore our most popular courses and start learning today.</p>
            </div>
            <Link to="/courses" className="hidden md:inline-flex text-primary-600 hover:text-primary-700 font-semibold items-center gap-2 transition-colors">
              View All Courses <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <div key={course._id} className="card hover:-translate-y-2 transition-transform duration-300 group cursor-pointer">
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 shadow-sm">{course.category}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2">{course.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 text-sm leading-relaxed">{course.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{course.price}</span>
                    <div className="flex items-center gap-4">
                      <button onClick={(e) => toggleWishlist(e, course._id)} className="text-gray-400 hover:text-red-500 transition-colors z-20 relative" title="Add to Wishlist">
                        {wishlist.includes(course._id) ? (
                          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        )}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleEnrollClick(course); }} className="text-primary-600 font-semibold hover:text-indigo-600 z-20 relative px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">Enroll Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link to="/courses" className="btn-primary w-full inline-block">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50 dark:bg-dark-surface border-y border-slate-100 dark:border-dark-border relative z-10">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-primary-600 mb-2">150+</p>
            <p className="text-slate-500 font-medium">Expert Instructors</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary-600 mb-2">1,200+</p>
            <p className="text-slate-500 font-medium">Video Courses</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary-600 mb-2">50k+</p>
            <p className="text-slate-500 font-medium">Active Students</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary-600 mb-2">99%</p>
            <p className="text-slate-500 font-medium">Success Rate</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16">Why Choose SkillNova?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="card p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl transform rotate-3">💻</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Learn Anywhere</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Access your courses from any device, anywhere in the world. Learning has never been this flexible.</p>
            </div>
            <div className="card p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl transform -rotate-3">🎓</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Earn Certificates</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Get industry-recognized certificates upon completion to showcase your skills to employers.</p>
            </div>
            <div className="card p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl transform rotate-3">⏱️</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Lifetime Access</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pay once and get lifetime access to course materials, including all future updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8">
              
              {/* Basic Plan */}
              <div className="flex-1 card p-8 border-2 border-transparent hover:border-primary-500 transition-colors">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Basic Plan</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Perfect for beginners</p>
                <div className="text-4xl font-extrabold text-primary-600 mb-8">$29<span className="text-lg text-slate-500 font-medium">/month</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="text-green-500">✓</span> Access to 100+ basic courses
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="text-green-500">✓</span> Community forum access
                  </li>
                  <li className="flex items-center gap-3 text-slate-400">
                    <span>×</span> No 1-on-1 mentorship
                  </li>
                </ul>
                <Link to="/courses" className="btn-primary w-full block text-center py-3">Get Started</Link>
              </div>

              {/* Pro Plan */}
              <div className="flex-1 card p-8 border-2 border-primary-500 relative transform md:-translate-y-4 shadow-xl overflow-visible">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold">Most Popular</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pro Plan</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">For serious learners</p>
                <div className="text-4xl font-extrabold text-primary-600 mb-8">$79<span className="text-lg text-slate-500 font-medium">/month</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="text-green-500">✓</span> Unlimited access to all courses
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="text-green-500">✓</span> 1-on-1 mentorship sessions
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="text-green-500">✓</span> Real-world projects & reviews
                  </li>
                </ul>
                <Link to="/courses" className="btn-primary w-full block text-center py-3">Get Pro</Link>
              </div>

            </div>
            <div className="bg-slate-50 dark:bg-dark-bg p-4 flex justify-end">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
