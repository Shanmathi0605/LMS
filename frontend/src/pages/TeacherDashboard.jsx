import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // Fetch courses where instructor is the current user
        const { data } = await axios.get('http://localhost:5000/api/courses');
        const filtered = data.filter(c => c.instructor?._id === user?._id || c.instructor === user?._id);
        setMyCourses(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyCourses();
  }, [user]);

  if (loading) return <div className="text-center mt-20">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Teacher Dashboard</h1>
        <button className="btn-primary">+ Create New Course</button>
      </div>
      
      {!user?.isApproved && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Pending Approval</p>
          <p>Your teacher account is waiting for admin approval. You cannot publish courses yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-primary-500">
          <h3 className="text-lg font-semibold mb-2">My Courses</h3>
          <p className="text-3xl font-bold text-primary-600">{myCourses.length}</p>
        </div>
        <div className="card p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
      {myCourses.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4">Course Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCourses.map(course => (
                <tr key={course._id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="p-4 font-medium">{course.title}</td>
                  <td className="p-4">{course.category}</td>
                  <td className="p-4">${course.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-primary-600 hover:underline mr-3">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
