import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaLock, FaPlayCircle } from 'react-icons/fa';
import CourseReviews from './CourseReviews';
import AuthContext from '../context/AuthContext';
import LoginPromptModal from './LoginPromptModal';

const CoursePreviewModal = ({ course, isOpen, onClose }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { user } = useContext(AuthContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [email, setEmail] = useState('');
  
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // 'video', 'quiz', 'forum'
  
  const [questions, setQuestions] = useState([]);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [replyContent, setReplyContent] = useState({}); // { questionId: content }

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const checkUserEnrollment = async () => {
      if (!course || !isOpen) return;
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;
        if (!token) return;

        const { data } = await axios.get(`http://localhost:5000/api/enrollments/check/${course._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (data.isEnrolled) {
          setIsPaid(true);
        }
      } catch (err) {
        console.error('Error checking enrollment', err);
      }
    };
    checkUserEnrollment();
  }, [course, isOpen]);

  useEffect(() => {
    if (isPaid && course) {
      fetchQuizzes();
      fetchQuestions();
    }
  }, [isPaid, course]);

  const fetchQuizzes = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      if (!token) return;
      
      const { data } = await axios.get(`http://localhost:5000/api/courses/${course._id}/quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(data);
    } catch (err) {
      console.error('Error fetching quizzes', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      if (!token) return;
      
      const { data } = await axios.get(`http://localhost:5000/api/courses/${course._id}/forum`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions', err);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      
      await axios.post(`http://localhost:5000/api/courses/${course._id}/forum`, {
        title: newQuestionTitle,
        content: newQuestionContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewQuestionTitle('');
      setNewQuestionContent('');
      fetchQuestions(); // Refresh list
    } catch (err) {
      console.error('Error asking question', err);
      alert('Failed to post question. Ensure you are enrolled.');
    }
  };

  const handleAddReply = async (questionId) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      
      await axios.post(`http://localhost:5000/api/forum/${questionId}/reply`, {
        content: replyContent[questionId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReplyContent({ ...replyContent, [questionId]: '' });
      fetchQuestions(); // Refresh list
    } catch (err) {
      console.error('Error posting reply', err);
      alert('Failed to post reply.');
    }
  };

  const handleUpvote = async (questionId) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      
      await axios.put(`http://localhost:5000/api/forum/${questionId}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchQuestions(); // Refresh to get updated upvotes
    } catch (err) {
      console.error('Error upvoting', err);
    }
  };

  const handleQuizSubmit = async (quizId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      
      // Convert answers object to array based on question order
      const answersArray = activeQuiz.questions.map((q, i) => quizAnswers[i] !== undefined ? quizAnswers[i] : -1);

      const { data } = await axios.post(`http://localhost:5000/api/quizzes/${quizId}/submit`, {
        answers: answersArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setQuizResult(data);
    } catch (err) {
      console.error('Error submitting quiz', err);
      alert('Failed to submit quiz');
    }
  };

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

  const handleMarkComplete = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      if (!token) return;
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Simulating marking the first lesson as complete
      // In a real app we'd map through course.lessons and get the active lessonId
      const dummyLessonId = course.lessons?.[0]?._id || '000000000000000000000000'; 
      
      await axios.put(`http://localhost:5000/api/enrollments/${course._id}/progress`, {
        lessonId: dummyLessonId
      }, config);
      
      alert(`Progress updated! Check your dashboard.`);
    } catch (err) {
      console.error('Error updating progress', err);
      alert(`Failed to update progress: ${err.response?.data?.message || err.message}`);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!email || !email.includes('@')) {
      alert('Email not found. Please re-login.');
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

      // Retrieve token for protected routes
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Create order on the backend
      const orderRes = await axios.post('http://localhost:5000/api/payment/orders', {
        amount: course.price,
        currency: 'INR',
      }, config);

      // 2. Fetch Razorpay key
      const keyRes = await axios.get('http://localhost:5000/api/payment/config');
      const razorpayKeyId = keyRes.data.key;



      const options = {
        key: razorpayKeyId,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'SkillNova',
        description: `Payment for ${course.title}`,
        image: 'https://via.placeholder.com/150', // Dummy logo
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            // 4. Verify payment on the backend & enroll user
            const verifyRes = await axios.post('http://localhost:5000/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id
            }, config);

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
          name: user.name || 'Student',
          email: user.email || '',
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl relative flex flex-col max-h-[95vh]">
        
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

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Column (Main Content) */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200 dark:border-slate-700">
            {/* Header Tabs if Paid */}
            {isPaid && (
          <div className="flex border-b border-gray-200 dark:border-slate-700">
            <button 
              className={`flex-1 py-3 font-semibold text-sm transition-colors ${activeTab === 'video' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}
              onClick={() => setActiveTab('video')}
            >
              Course Video
            </button>
            <button 
              className={`flex-1 py-3 font-semibold text-sm transition-colors ${activeTab === 'quiz' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}
              onClick={() => setActiveTab('quiz')}
            >
              Quizzes & Assignments ({quizzes.length})
            </button>
            <button 
              className={`flex-1 py-3 font-semibold text-sm transition-colors ${activeTab === 'forum' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}
              onClick={() => setActiveTab('forum')}
            >
              Q&A Forum
            </button>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'video' || !isPaid ? (
              <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                {!isPaid ? (
                  <>
                  {/* Dummy Preview Video in Background */}
                  <video 
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    autoPlay 
                    muted 
                    loop 
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
                  />
                  <div className="relative z-10 flex flex-col items-center justify-center bg-slate-900/70 p-8 rounded-2xl backdrop-blur-md border border-slate-700/50 shadow-xl max-w-sm text-center w-full">
                    <div className="bg-red-500/20 p-4 rounded-full mb-4">
                      <FaLock className="text-red-500 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Premium Content</h3>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-2">Ready to master {course.title}?</h4>
                    <p className="text-slate-300 mb-6 text-sm">
                      Get full lifetime access to all {course.lessons?.length || 0} lessons, assignments, and a certificate of completion.
                    </p>

                    <button 
                      onClick={handlePayment}
                      disabled={loadingPayment}
                      className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loadingPayment ? (
                        <span className="animate-pulse">Processing...</span>
                      ) : (
                        <>Access Course (₹{course.price})</>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center bg-black relative">
                  <video 
                    className="w-full h-[85%] object-contain bg-black"
                    controls 
                    autoPlay 
                    src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="w-full h-[15%] bg-slate-900 border-t border-slate-700 flex items-center justify-between px-6">
                    <span className="text-white font-semibold flex items-center gap-2"><FaPlayCircle className="text-primary-500" /> Lesson 1: Introduction</span>
                    <button 
                      onClick={handleMarkComplete}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm shadow-lg"
                    >
                      ✓ Mark as Complete
                    </button>
                  </div>
                </div>
              )}
            </div>
            ) : activeTab === 'quiz' ? (
              <div className="relative w-full min-h-[50vh] bg-slate-50 dark:bg-slate-900 p-8 overflow-y-auto">
                {quizzes.length === 0 ? (
                  <div className="text-center text-slate-500 py-12">
                    No quizzes available for this course yet.
                  </div>
                ) : !activeQuiz ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Course Quizzes</h3>
                    {quizzes.map(quiz => (
                      <div key={quiz._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-lg text-slate-800 dark:text-white">{quiz.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{quiz.questions?.length || 0} Questions • Passing Score: {quiz.passingScore}%</p>
                        </div>
                        <button 
                          onClick={() => { setActiveQuiz(quiz); setQuizAnswers({}); setQuizResult(null); }}
                          className="btn-primary"
                        >
                          Start Quiz
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto">
                    <button 
                      onClick={() => setActiveQuiz(null)}
                      className="text-primary-600 text-sm font-semibold mb-6 flex items-center hover:underline"
                    >
                      ← Back to Quizzes
                    </button>
                    
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 border-b pb-4 dark:border-slate-700">
                      {activeQuiz.title}
                    </h3>

                    {quizResult ? (
                      <div className={`p-8 rounded-2xl text-center border-2 ${quizResult.passed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="text-6xl mb-4">{quizResult.passed ? '🎉' : '💻'}</div>
                        <h4 className={`text-2xl font-bold mb-2 ${quizResult.passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          {quizResult.passed ? 'Congratulations, you passed!' : 'You did not pass. Keep learning!'}
                        </h4>
                        <div className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                          You scored <span className="font-bold">{quizResult.percentage}%</span> ({quizResult.score} out of {quizResult.total})
                        </div>
                        <button onClick={() => { setQuizResult(null); setQuizAnswers({}); }} className="btn-primary">
                          {quizResult.passed ? 'Retake for fun' : 'Try Again'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {activeQuiz.questions.map((q, qIndex) => (
                          <div key={qIndex} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-4">
                              <span className="text-primary-600 mr-2">Q{qIndex + 1}.</span> 
                              {q.questionText}
                            </h4>
                            <div className="space-y-3">
                              {q.options.map((opt, optIndex) => (
                                <label key={optIndex} className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${quizAnswers[qIndex] === optIndex ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                  <input 
                                    type="radio" 
                                    name={`question-${qIndex}`}
                                    className="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
                                    checked={quizAnswers[qIndex] === optIndex}
                                    onChange={() => setQuizAnswers({...quizAnswers, [qIndex]: optIndex})}
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex justify-end pt-4">
                          <button 
                            onClick={() => handleQuizSubmit(activeQuiz._id)}
                            disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            Submit Answers
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full min-h-[50vh] bg-slate-50 dark:bg-slate-900 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Course Q&A Forum</h3>
                  
                  {/* Ask Question Form */}
                  <form onSubmit={handleAskQuestion} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
                    <h4 className="font-semibold text-lg mb-4 text-slate-800 dark:text-white">Ask a new question</h4>
                    <input 
                      type="text"
                      placeholder="Question Title (e.g. How do I setup the environment?)"
                      className="input-field mb-4 w-full"
                      value={newQuestionTitle}
                      onChange={(e) => setNewQuestionTitle(e.target.value)}
                      required
                    />
                    <textarea 
                      placeholder="Describe your question in detail..."
                      className="input-field mb-4 w-full h-32 resize-none"
                      value={newQuestionContent}
                      onChange={(e) => setNewQuestionContent(e.target.value)}
                      required
                    ></textarea>
                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary">Post Question</button>
                    </div>
                  </form>

                  {/* Questions List */}
                  <div className="space-y-6">
                    {questions.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">No questions asked yet. Be the first!</div>
                    ) : (
                      questions.map(q => (
                        <div key={q._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex gap-4">
                          {/* Upvote Column */}
                          <div className="flex flex-col items-center">
                            <button 
                              onClick={() => handleUpvote(q._id)}
                              className={`p-2 rounded-full transition-colors ${q.upvotes.includes(user?._id) ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
                            </button>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{q.upvotes.length}</span>
                          </div>
                          
                          {/* Question Content */}
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{q.title}</h4>
                            <p className="text-slate-600 dark:text-slate-400 mb-4 whitespace-pre-wrap">{q.content}</p>
                            <div className="flex items-center gap-3 text-sm text-slate-500 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs uppercase">
                                  {q.user.name.charAt(0)}
                                </div>
                                <span className="font-medium">{q.user.name}</span>
                              </div>
                              <span>•</span>
                              <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Replies */}
                            <div className="space-y-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                              {q.replies && q.replies.map(reply => (
                                <div key={reply._id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`font-bold text-sm ${reply.isInstructor ? 'text-primary-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                      {reply.user.name}
                                    </span>
                                    {reply.isInstructor && <span className="bg-primary-100 text-primary-800 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Instructor</span>}
                                    <span className="text-xs text-slate-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{reply.content}</p>
                                </div>
                              ))}
                              
                              {/* Add Reply */}
                              <div className="mt-4 flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Write a reply..."
                                  className="input-field flex-1 py-2 px-4 text-sm"
                                  value={replyContent[q._id] || ''}
                                  onChange={(e) => setReplyContent({ ...replyContent, [q._id]: e.target.value })}
                                />
                                <button 
                                  onClick={() => handleAddReply(q._id)}
                                  disabled={!replyContent[q._id]}
                                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Details & Reviews) */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-6">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full font-semibold">{course.category}</span>
             <span className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs px-3 py-1 rounded-full font-semibold">
               {course.duration > 0 ? `${course.duration} hours` : 'Self-paced'}
             </span>
          </div>
          <h3 className="font-semibold text-lg mb-2 dark:text-white">About this course</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-6">
            {course.description}
          </p>

          <CourseReviews courseId={course._id} />
        </div>
      </div>
    </div>

      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        message="Please log in to access this feature."
      />
    </div>
  );
};

export default CoursePreviewModal;
