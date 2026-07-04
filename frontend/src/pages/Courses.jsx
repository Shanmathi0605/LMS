import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CoursePreviewModal from '../components/CoursePreviewModal';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/courses');
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading courses...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">All Courses</h1>
        <Link to="/" className="text-primary-600 hover:underline">Back to Home</Link>
      </div>
      
      {courses.length === 0 ? (
        <div className="text-center text-gray-500">No courses available right now.</div>
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
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary-600 font-bold">${course.price}</span>
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">{course.category}</span>
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
    </div>
  );
};

export default Courses;
