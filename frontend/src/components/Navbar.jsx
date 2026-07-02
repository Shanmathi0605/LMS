import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>
          EduLearn
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">Home</Link>
          <Link to="/courses" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">All Courses</Link>
          <Link to="/categories" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">Categories</Link>
          <Link to="/instructors" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">Instructors</Link>
          <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium transition-colors">About Us</Link>
          
          {user ? (
            <div className="flex items-center gap-4 border-l pl-6 dark:border-slate-700">
              <button className="text-slate-500 hover:text-primary-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
              
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 transition-colors">{user.name}</span>
              </div>
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
