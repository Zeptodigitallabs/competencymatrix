// src/components/common/Notification/Notification.jsx
import React, { useState, useEffect } from 'react';

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!visible) return null;

  return (
    <div 
      className={`fixed top-4 right-4 p-4 rounded-md ${
        type === 'success' ? 'bg-green-50 text-green-700' : 
        type === 'error' ? 'bg-red-50 text-red-700' :
        type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
        'bg-blue-50 text-blue-700'
      } shadow-lg z-50 max-w-sm`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'success' ? '✅' : 
           type === 'error' ? '❌' :
           type === 'warning' ? '⚠️' : 'ℹ️'}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md focus:outline-none"
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
            aria-label="Close notification"
          >
            <span className="text-gray-400 hover:text-gray-500">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;