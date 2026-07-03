import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import CreateCourseModal from '../components/CreateCourseModal';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    pendingTeachers: 0,
    totalCourses: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [statsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', config),
          axios.get('http://localhost:5000/api/admin/users', config)
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching admin data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  const handleApproveTeacher = async (userId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.put(`http://localhost:5000/api/admin/users/${userId}/approve`, {}, config);
      
      setUsers(users.map(u => u._id === userId ? { ...u, isApproved: true } : u));
      setStats(prev => ({ ...prev, pendingTeachers: prev.pendingTeachers > 0 ? prev.pendingTeachers - 1 : 0 }));
      alert(`Teacher ${data.name} approved successfully`);
    } catch (error) {
      console.error('Error approving teacher', error);
      alert('Failed to approve teacher');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
      
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  const pendingTeachers = users.filter(u => u.role === 'teacher' && !u.isApproved);
  const otherUsers = users.filter(u => u.role !== 'admin' && !(u.role === 'teacher' && !u.isApproved));

  const handleCourseCreated = (newCourse) => {
    setStats(prev => ({ ...prev, totalCourses: prev.totalCourses + 1 }));
    alert(`Course "${newCourse.title}" created successfully!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Welcome back, {user?.name}. Here is what's happening on EduLearn.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              + Add New Course
            </button>
            <span className="px-4 py-2 bg-primary-100 text-primary-700 font-bold rounded-lg dark:bg-primary-900/30 dark:text-primary-400 flex items-center">
              Admin Access
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 border-l-4 border-blue-500">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total Students</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalStudents}</p>
          </div>
          <div className="card p-6 border-l-4 border-green-500">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total Teachers</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalTeachers}</p>
          </div>
          <div className="card p-6 border-l-4 border-yellow-500">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Pending Teachers</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pendingTeachers}</p>
          </div>
          <div className="card p-6 border-l-4 border-purple-500">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total Courses</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalCourses}</p>
          </div>
        </div>

        {/* Pending Approvals */}
        {pendingTeachers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 border-b pb-2 dark:border-slate-700">Action Required: Pending Teachers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingTeachers.map(teacher => (
                <div key={teacher._id} className="card p-6 border border-yellow-200 dark:border-yellow-900/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{teacher.name}</h3>
                      <p className="text-slate-500 text-sm">{teacher.email}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold dark:bg-yellow-900/30 dark:text-yellow-500">Pending</span>
                  </div>
                  <button 
                    onClick={() => handleApproveTeacher(teacher._id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    Approve Account
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Users List */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 border-b pb-2 dark:border-slate-700">Manage Users</h2>
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {otherUsers.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          u.role === 'teacher' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${u.isApproved ? 'text-green-500' : 'text-yellow-500'}`}>
                          {u.isApproved ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {otherUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
      
      <CreateCourseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCourseCreated={handleCourseCreated}
      />
    </div>
  );
};

export default AdminDashboard;
