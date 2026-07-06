import { useState } from 'react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to SkillNova! Explore our top courses.', time: '2 hours ago', read: false, type: 'info' },
    { id: 2, text: 'New Course Added: Mastering Mobile Design.', time: '1 day ago', read: false, type: 'course' },
    { id: 3, text: 'Your certificate for React 18 is ready.', time: '2 days ago', read: true, type: 'certificate' },
    { id: 4, text: 'Payment successful for Advanced Node.js Architecture.', time: '3 days ago', read: true, type: 'payment' },
    { id: 5, text: 'Reminder: Live session for Python Data Science starts in 1 hour.', time: '4 days ago', read: true, type: 'reminder' }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'course': return '📚';
      case 'certificate': return '🎓';
      case 'payment': return '💳';
      case 'reminder': return '⏰';
      default: return '👋';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated with your latest alerts and messages</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={markAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium py-2 px-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 transition-colors"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No notifications yet</p>
            <p className="mt-1">When you get notifications, they'll show up here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-5 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!notif.read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-xl flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-slate-800 dark:text-slate-200 ${!notif.read ? 'font-semibold' : ''}`}>
                      {notif.text}
                    </p>
                    {!notif.read && <span className="w-2.5 h-2.5 rounded-full bg-primary-600 shrink-0 mt-1.5"></span>}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{notif.time}</p>
                </div>
                <button 
                  onClick={() => deleteNotification(notif.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 shrink-0 self-center md:self-start"
                  title="Delete notification"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
