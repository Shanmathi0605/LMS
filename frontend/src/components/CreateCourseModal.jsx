import { useState } from 'react';
import axios from 'axios';

const CreateCourseModal = ({ isOpen, onClose, onCourseCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await axios.post(
        'https://lms-dg3c.onrender.com/api/courses',
        { ...formData, isPublished: true },
        config
      );

      onCourseCreated(data);
      onClose();
      // Reset form
      setFormData({ title: '', description: '', category: '', thumbnail: '', price: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-dark-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Course</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
              <input 
                type="text" 
                name="title"
                required 
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="e.g. Advanced React Masterclass"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                name="description"
                required 
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="Describe what students will learn..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <input 
                  type="text" 
                  name="category"
                  required 
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                  placeholder="e.g. Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                <input 
                  type="number" 
                  name="price"
                  min="0"
                  step="0.01"
                  required 
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                  placeholder="29.99"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thumbnail Image URL</label>
              <input 
                type="url" 
                name="thumbnail"
                required 
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm shadow-primary-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseModal;
