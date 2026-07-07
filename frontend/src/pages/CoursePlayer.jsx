import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const CoursePlayer = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseTitle = searchParams.get('course') || 'Introduction to Web Development';
  
  const [activeVideo, setActiveVideo] = useState(0);
  
  // Dummy course content data
  const courseModules = [
    {
      id: 1,
      title: 'Module 1: Getting Started',
      videos: [
        { id: 101, title: 'Welcome to the Course', duration: '5:30', completed: true },
        { id: 102, title: 'Setting up your Environment', duration: '12:45', completed: true },
        { id: 103, title: 'Basic Concepts', duration: '18:20', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Module 2: Core Fundamentals',
      videos: [
        { id: 201, title: 'Understanding the Architecture', duration: '22:15', completed: false },
        { id: 202, title: 'Writing your first script', duration: '15:10', completed: false },
        { id: 203, title: 'Debugging Basics', duration: '10:05', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Module 3: Advanced Topics',
      videos: [
        { id: 301, title: 'State Management', duration: '25:00', completed: false },
        { id: 302, title: 'API Integration', duration: '20:30', completed: false },
        { id: 303, title: 'Deployment & Hosting', duration: '14:40', completed: false }
      ]
    }
  ];

  // Flatten videos for easy navigation
  const allVideos = courseModules.flatMap(m => m.videos);
  const currentVideo = allVideos[activeVideo];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-900 text-slate-200 flex flex-col lg:flex-row overflow-hidden">
      
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
        {/* Video Player Header (Mobile Only) */}
        <div className="lg:hidden p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 flex justify-between items-center">
          <Link to="/dashboard" className="text-primary-400 hover:text-primary-300 flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </Link>
          <h2 className="font-bold text-white truncate max-w-[200px]">{courseTitle}</h2>
        </div>

        {/* The Player */}
        <div className="w-full bg-black aspect-video relative group border-b border-slate-800 flex items-center justify-center">
          {/* Simulated Video Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-primary-600/80 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(79,70,229,0.5)] cursor-pointer hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white translate-x-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-slate-400 font-medium">Playing: {currentVideo?.title}</p>
          </div>
          
          {/* Fake Video Controls */}
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/80 to-transparent flex items-center px-4 gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-white hover:text-primary-400"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg></button>
            <div className="flex-1 h-1.5 bg-slate-600 rounded-full cursor-pointer relative">
              <div className="absolute top-0 left-0 h-full bg-primary-500 rounded-full w-1/3"></div>
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
            </div>
            <span className="text-xs text-white">05:12 / {currentVideo?.duration}</span>
            <button className="text-white hover:text-primary-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg></button>
          </div>
        </div>

        {/* Video Info Area */}
        <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{currentVideo?.title}</h1>
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveVideo(Math.max(0, activeVideo - 1))}
                disabled={activeVideo === 0}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                Previous
              </button>
              <button 
                onClick={() => setActiveVideo(Math.min(allVideos.length - 1, activeVideo + 1))}
                disabled={activeVideo === allVideos.length - 1}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                Next Lesson
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6 mb-6">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white text-xl">S</div>
            <div>
              <p className="text-white font-medium">SkillNova Instructor</p>
              <p className="text-slate-400 text-sm">Senior Developer & Educator</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">About this lesson</h3>
            <p className="text-slate-400 leading-relaxed">
              In this video, we will dive deep into {currentVideo?.title.toLowerCase()}. You'll learn the core concepts, 
              best practices, and how to apply them in real-world scenarios. Make sure to follow along with the code 
              examples provided in the resources section.
            </p>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 h-[calc(100vh-80px)] flex flex-col">
        <div className="p-5 border-b border-slate-800 hidden lg:block bg-slate-900">
          <Link to="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 mb-3 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </Link>
          <h2 className="font-bold text-white text-lg leading-snug">{courseTitle}</h2>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5">
            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '33%' }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">33% Completed (3/9 lessons)</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {courseModules.map((module, mIndex) => (
            <div key={module.id} className="mb-4">
              <h3 className="px-3 py-2 text-sm font-bold text-slate-300 bg-slate-800/50 rounded-lg mb-1">{module.title}</h3>
              <div className="flex flex-col gap-1">
                {module.videos.map((video) => {
                  const globalIndex = allVideos.findIndex(v => v.id === video.id);
                  const isActive = activeVideo === globalIndex;
                  return (
                    <button 
                      key={video.id}
                      onClick={() => setActiveVideo(globalIndex)}
                      className={`flex gap-3 text-left p-3 rounded-lg transition-colors group ${
                        isActive 
                          ? 'bg-primary-900/30 border border-primary-500/50' 
                          : 'hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {video.completed ? (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? 'bg-primary-500' : 'bg-green-500'}`}>
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-primary-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                            {isActive && <div className="w-2 h-2 bg-primary-500 rounded-full"></div>}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm leading-tight mb-1 ${isActive ? 'text-primary-300' : 'text-slate-200'}`}>
                          {video.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {video.duration}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
