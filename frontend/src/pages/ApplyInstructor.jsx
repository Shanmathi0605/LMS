import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ApplyInstructor = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The backend User model already sets isApproved to false if role is 'teacher'
      await register({ name, email, password, role: 'teacher' });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="card p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Application Submitted!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Thank you for applying to be an instructor. Our admin team will review your application. You will have full access once approved.
          </p>
          <p className="text-sm text-primary-600 font-medium animate-pulse">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12">
      <div className="card p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-primary-600">Become an Instructor</h2>
        <p className="text-center text-slate-500 mb-8">Join our community and share your knowledge with thousands of students.</p>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Full Name</label>
            <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Email Address</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Password</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" placeholder="Create a secure password" />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Why do you want to teach? (Experience)</label>
            <textarea 
              className="input-field min-h-[100px]" 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              required 
              placeholder="Briefly describe your teaching experience and what subjects you plan to teach..."
            ></textarea>
          </div>
          <button type="submit" className="btn-primary w-full text-lg py-3">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyInstructor;
