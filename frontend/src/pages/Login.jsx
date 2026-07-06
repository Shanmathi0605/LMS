import { useState, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdminLogin = searchParams.get('admin') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
      <div className="card p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-600">Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
        {!isAdminLogin && (
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:underline">Register here</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
