import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import AvatarCustomizerModal from '../components/AvatarCustomizerModal';

const ProfileSettings = () => {
  const { user, updateUser } = useContext(AuthContext);
  
  const [name, setName] = useState(user?.name || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await axios.put('http://localhost:5000/api/auth/profile', {
        name,
        profilePic,
        avatarUrl,
        password
      }, config);

      // Update local storage and context
      updateUser(data); 
      
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Profile Settings</h1>
        
        {message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">{message}</div>}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>}
        
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
          <div className="group relative w-32 h-32 flex-shrink-0 [perspective:1000px]">
            <div 
              className="w-full h-full relative duration-700 ease-in-out cursor-pointer group-hover:[transform:rotateY(180deg)] [transform-style:preserve-3d]"
              onClick={() => document.getElementById('profilePicInput').click()}
              title="Click to upload picture"
            >
              {/* Front side - Profile Photo */}
              <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border-4 border-primary-100 dark:border-primary-900/30 flex items-center justify-center [backface-visibility:hidden]">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.src = ''; setProfilePic(''); setError('Invalid image URL'); }} />
                ) : (
                  <span className="text-4xl font-bold text-primary-600">{name.charAt(0).toUpperCase()}</span>
                )}
                
                {/* Hover overlay with camera icon */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
              </div>

              {/* Back side - 3D Avatar Saying Hi */}
              <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 border-4 border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <img src={avatarUrl || "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=transparent"} alt="Avatar" className="w-[120%] h-[120%] object-cover mt-4" />
                <div className="absolute bottom-1 right-0 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-black px-2 py-1 rounded-full shadow-xl border-2 border-indigo-200 dark:border-slate-600 animate-bounce">
                  Hi! 👋
                </div>
              </div>
            </div>
            
            {/* Edit Avatar Button */}
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-10 border-2 border-white dark:border-slate-800"
              title="Customize Avatar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex-1 w-full">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{user?.name}</h2>
            <p className="text-slate-500 mb-2">{user?.email}</p>
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-xs font-bold rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <input 
          type="file" 
          id="profilePicInput" 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageChange} 
        />



        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
            <input 
              type="text" 
              className="input-field w-full"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          


          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="input-field w-full pr-10"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    minLength="6"
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="input-field w-full pr-10"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    minLength="6"
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="btn-primary w-full md:w-auto px-8"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Avatar Customizer Modal */}
      <AvatarCustomizerModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        initialAvatarUrl={avatarUrl}
        onSave={(newAvatarUrl) => {
          setAvatarUrl(newAvatarUrl);
          setIsAvatarModalOpen(false);
        }}
      />
    </div>
  );
};

export default ProfileSettings;
