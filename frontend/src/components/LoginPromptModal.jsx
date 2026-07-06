import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scale-up">
        <div className="flex justify-center mb-4 text-primary-500">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Login Required</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
          {message || 'You need to be logged in to perform this action.'}
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="btn-primary w-full"
          >
            Go to Login
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-2xl font-bold transition-all w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
