import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: 'Welcome to SkillNova! Explore our top courses.', time: '2h ago', read: false },
    { id: 2, text: 'New Course Added: Mastering Mobile Design.', time: '1d ago', read: false },
    { id: 3, text: 'Your certificate for React 18 is ready.', time: '2d ago', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to={user?.role === 'admin' ? '/admin-dashboard' : '/'} className="text-2xl font-bold text-primary-600 flex items-center gap-2">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>
          SkillNova
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          {(!user || user.role !== 'admin') && (
            <>
              <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">Home</Link>
              <Link to="/courses" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">All Courses</Link>
              <Link to="/categories" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">Categories</Link>
              <Link to="/instructors" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">Instructors</Link>
              <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">About Us</Link>
            </>
          )}
          
          {user ? (
            <div className="flex items-center gap-4 border-l pl-6 dark:border-slate-700">
              {user.role !== 'admin' && (
                <>
                  {/* Wishlist */}
                  <Link to="/wishlist" className="relative text-slate-500 hover:text-red-500 transition-colors p-1" title="My Wishlist">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  </Link>

                  {/* Notifications Dropdown */}
                  <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative text-slate-500 hover:text-primary-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">{unreadCount}</span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                      <button className="text-xs text-primary-600 hover:underline">Mark all as read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-primary-600' : 'bg-transparent'}`}></div>
                          <div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{notif.text}</p>
                            <span className="text-xs text-slate-400 mt-1 block">{notif.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-slate-100 dark:border-slate-700">
                      <Link 
                        to="/notifications" 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-sm text-primary-600 hover:underline font-medium"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              </>)}
              
              <Link to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-primary-600 transition-colors ml-4 mr-2">
                {user.role === 'admin' ? 'Admin Dashboard' : user.role === 'instructor' || user.role === 'teacher' ? 'Instructor Dashboard' : 'My Learning'}
              </Link>

              <Link to="/settings" className="flex items-center gap-2 cursor-pointer group ml-2">
                <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold overflow-hidden border border-primary-200">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 transition-colors hidden sm:block">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ml-2">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l pl-6 dark:border-slate-700">
              <Link to="/login" className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up Free</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
