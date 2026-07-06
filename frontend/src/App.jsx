import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Categories from './pages/Categories';
import Instructors from './pages/Instructors';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Notifications from './pages/Notifications';
import Wishlist from './pages/Wishlist';
import ApplyInstructor from './pages/ApplyInstructor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/instructors" element={<Instructors />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/dashboard" element={<StudentDashboard />} />

              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/apply-instructor" element={<ApplyInstructor />} />

              {/* Catch-all 404 route */}
              <Route path="*" element={
                <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
                  <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
                  <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                  <p className="text-slate-600 mb-8">The page you are looking for does not exist or has been moved.</p>
                  <a href="/" className="btn-primary">Go back to Home</a>
                </div>
              } />
            </Routes>
          </Layout>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
