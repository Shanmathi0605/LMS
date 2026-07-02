import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from /api/enrollments/my
    // For now, we mock it or show empty state
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center mt-20">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Welcome, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 bg-primary-50 dark:bg-dark-surface border-l-4 border-primary-500">
          <h3 className="text-lg font-semibold mb-2">Enrolled Courses</h3>
          <p className="text-3xl font-bold text-primary-600">{enrollments.length}</p>
        </div>
        <div className="card p-6 bg-blue-50 dark:bg-dark-surface border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-2">Completed</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="card p-6 bg-green-50 dark:bg-dark-surface border-l-4 border-green-500">
          <h3 className="text-lg font-semibold mb-2">Certificates</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">My Learning</h2>
      {enrollments.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map through enrolled courses here */}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
