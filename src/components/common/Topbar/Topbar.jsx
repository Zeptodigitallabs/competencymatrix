import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/actions/authActions';

const Topbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Dispatch the logout action and wait for it to complete
      await dispatch(logout());
      // Navigate to login after successful logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Competency Matrix</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">Organization: Acme Learning</div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
