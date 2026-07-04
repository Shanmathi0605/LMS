import { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaLock, FaPlayCircle } from 'react-icons/fa';

const CoursePreviewModal = ({ course, isOpen, onClose }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [email, setEmail] = useState('');

  if (!isOpen || !course) return null;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address first.');
      return;
    }

    setLoadingPayment(true);
    
    try {
      // Check if already enrolled in DB
      const checkRes = await axios.get(`http://localhost:5000/api/payment/check-enrollment?email=${encodeURIComponent(email)}&courseId=${course._id}`);
      
      if (checkRes.data.enrolled) {
         // Already purchased!
         setIsPaid(true);
         setLoadingPayment(false);
         return;
      }

      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoadingPayment(false);
        return;
      }

      // 1. Create order on the backend
      const orderRes = await axios.post('http://localhost:5000/api/payment/orders', {
        amount: course.price,
        currency: 'USD',
      });

      // 2. Fetch Razorpay key
      const keyRes = await axios.get('http://localhost:5000/api/payment/config');
      const razorpayKeyId = keyRes.data.key;

      const options = {
        key: razorpayKeyId,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'EduLearn',
        description: `Payment for ${course.title}`,
        image: 'https://via.placeholder.com/150', // Dummy logo
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            // 3. Verify payment on the backend & enroll user
            const verifyRes = await axios.post('http://localhost:5000/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: email,
              courseId: course._id
            });

            if (verifyRes.data.success) {
              setIsPaid(true);
            } else {
              alert('Payment verification failed');
            }
          } catch (err) {
            console.error('Verification Error:', err);
            const errorMsg = err.response?.data?.msg || err.response?.data?.message || err.message;
            alert('Error verifying payment: ' + errorMsg);
          }
        },
        prefill: {
          name: 'Student',
          email: email,
          contact: ''
        },
        theme: {
          color: '#4f46e5' // Indigo-600 to match theme
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('An error occurred during payment');
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white truncate pr-4">{course.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {!isPaid ? (
            <>
              {/* Mock Video Poster for locked state */}
              <img 
                src={course.thumbnail !== 'no-photo.jpg' ? course.thumbnail : 'https://via.placeholder.com/800x450?text=Course+Video'} 
                alt="Video Poster" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="relative z-10 flex flex-col items-center justify-center bg-slate-900/70 p-8 rounded-2xl backdrop-blur-md border border-slate-700/50 shadow-xl max-w-sm text-center w-full">
                <div className="bg-red-500/20 p-4 rounded-full mb-4">
                  <FaLock className="text-red-500 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium Content</h3>
                <p className="text-slate-300 mb-6 text-sm">Unlock this course to get full access to all video lectures, materials, and projects.</p>
                
                <div className="w-full mb-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email to unlock" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    required
                  />
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={loadingPayment}
                  className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingPayment ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>Access Course (${course.price})</>
                  )}
                </button>
              </div>
            </>
          ) : (
            <video 
              className="absolute inset-0 w-full h-full object-contain bg-black"
              controls 
              autoPlay 
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Details Footer */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full font-semibold">{course.category}</span>
             <span className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs px-3 py-1 rounded-full font-semibold">
               {course.duration > 0 ? `${course.duration} hours` : 'Self-paced'}
             </span>
          </div>
          <h3 className="font-semibold text-lg mb-2 dark:text-white">About this course</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            {course.description}
          </p>
        </div>

      </div>
    </div>
  );
};

export default CoursePreviewModal;
