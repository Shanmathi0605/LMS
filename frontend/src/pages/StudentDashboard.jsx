import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { generateCertificate } from '../utils/generateCertificate';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;
        const { data } = await axios.get('https://lms-dg3c.onrender.com/api/enrollments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrollments(data);
      } catch (err) {
        console.error('Error fetching enrollments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [user, navigate]);

  if (loading) return <div className="text-center mt-20">Loading your learning dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Learning</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Track your progress and continue learning.</p>
        </div>
        <Link to="/courses" className="btn-primary">Explore More Courses</Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">You haven't enrolled in any courses yet</h2>
          <p className="text-slate-500 mb-6">Start your learning journey today!</p>
          <Link to="/courses" className="btn-primary inline-block">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="card p-5 hover:shadow-lg transition-shadow">
              <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden relative">
                {enrollment.course?.thumbnail && enrollment.course.thumbnail !== 'no-photo.jpg' ? (
                  <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                )}
                
                {enrollment.status === 'completed' && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Completed 🏆
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white line-clamp-2 h-14">
                {enrollment.course?.title || 'Unknown Course'}
              </h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Progress</span>
                  <span className="text-primary-600 font-bold">{enrollment.progressPercentage || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${enrollment.progressPercentage === 100 ? 'bg-green-500' : 'bg-primary-600'}`}
                    style={{ width: `${enrollment.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <Link 
                to={`/courses?category=${encodeURIComponent(enrollment.course?.title)}`}
                className="w-full block text-center py-2 bg-slate-100 hover:bg-primary-50 text-primary-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-primary-900/30 rounded-lg font-semibold transition-colors mb-3"
                onClick={(e) => {
                  e.preventDefault();
                  alert("This would normally open the course player module. For now, preview the course to see the video player.");
                }}
              >
                {enrollment.progressPercentage === 0 ? 'Start Course' : enrollment.progressPercentage === 100 ? 'Review Course' : 'Continue Learning'}
              </Link>
              
              {enrollment.progressPercentage === 100 && (
                <button
                  onClick={() => generateCertificate(user.name, enrollment.course?.title || 'Unknown Course')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105 shadow-md flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Download Certificate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
