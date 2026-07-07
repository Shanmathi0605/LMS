import { useState, useEffect } from 'react';

const AvatarCustomizerModal = ({ isOpen, onClose, initialAvatarUrl, onSave }) => {
  // Try to determine if current avatar is female based on seed
  const isCurrentlyFemale = initialAvatarUrl && initialAvatarUrl.includes('seed=Aneka');
  const [gender, setGender] = useState(isCurrentlyFemale ? 'female' : 'male');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    // Set predefined avatars based on gender choice
    if (gender === 'male') {
      setPreviewUrl('https://api.dicebear.com/7.x/micah/svg?seed=Jack&hair=fonze&mouth=smile&shirt=collared&backgroundColor=transparent');
    } else {
      setPreviewUrl('https://api.dicebear.com/7.x/micah/svg?seed=Aneka&hair=full&mouth=smile&shirt=crew&backgroundColor=transparent');
    }
  }, [gender]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left side: Preview */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 p-8 flex flex-col items-center justify-center border-r border-indigo-50 dark:border-slate-700">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 text-center">Avatar Preview</h2>
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-white/50 dark:bg-slate-700/50 shadow-xl border-4 border-white dark:border-slate-600 flex items-center justify-center overflow-hidden mb-8 relative">
             <img src={previewUrl} alt="Avatar Preview" className="w-[120%] h-[120%] object-cover mt-6 transform transition-transform duration-300" />
          </div>
        </div>

        {/* Right side: Controls */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-2">Choose Avatar Type</h3>
          
          <div className="space-y-4 mb-8">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                gender === 'male' 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${gender === 'male' ? 'border-indigo-600' : 'border-slate-400'}`}>
                {gender === 'male' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
              </div>
              <span className={`text-lg font-bold ${gender === 'male' ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                Male Avatar
              </span>
            </button>

            <button
              type="button"
              onClick={() => setGender('female')}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                gender === 'female' 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${gender === 'female' ? 'border-indigo-600' : 'border-slate-400'}`}>
                {gender === 'female' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
              </div>
              <span className={`text-lg font-bold ${gender === 'female' ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                Female Avatar
              </span>
            </button>
          </div>

          <div className="flex gap-4 mt-auto">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={() => onSave(previewUrl)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors"
            >
              Save Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizerModal;
