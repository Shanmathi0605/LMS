import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t-2 border-white dark:border-slate-800 py-12 mt-20 relative z-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="text-2xl font-bold text-primary-600 mb-4 inline-block">SkillNova</Link>
          <p className="text-slate-500 dark:text-slate-400">Empowering learners worldwide with accessible, high-quality education and skills for the future.</p>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-slate-800 dark:text-slate-200">Platform</h3>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link to="/courses" className="hover:text-primary-600 transition-colors">Browse Courses</Link></li>
            <li><Link to="/categories" className="hover:text-primary-600 transition-colors">Categories</Link></li>
            <li><Link to="/instructors" className="hover:text-primary-600 transition-colors">Instructors</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-slate-800 dark:text-slate-200">Company</h3>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link to="/about" className="hover:text-primary-600 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary-600 transition-colors">Contact</Link></li>
            <li><Link to="/careers" className="hover:text-primary-600 transition-colors">Careers</Link></li>
            <li><Link to="/apply-instructor" className="hover:text-primary-600 transition-colors text-primary-600 font-semibold">Become an Instructor</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-slate-800 dark:text-slate-200">Legal</h3>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link to="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} SkillNova Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
