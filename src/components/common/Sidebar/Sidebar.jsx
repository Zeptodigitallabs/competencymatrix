import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavItem = ({ label, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full px-4 py-2 text-left rounded-md transition-colors ${
      active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    {Icon && <Icon className="w-5 h-5" />}
    <span>{label}</span>
  </button>
);

const Sidebar = ({ userRole }) => {
  const [expandedItems, setExpandedItems] = React.useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Get current view from URL
  const getCurrentView = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    return pathParts.length > 1 ? pathParts[pathParts.length - 1] : 'dashboard';
  };

  const toggleItem = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard' },
    ];

    const adminItems = [
      { id: 'competency-library', label: 'Competency Management' },
      { id: 'role-mapping', label: 'Role Mappings' },
      { id: 'reports', label: 'Reports & Analytics' },
      { 
        id: 'masters', 
        label: 'Masters',
        children: [
          { id: 'competency-category', label: 'Competency Categories' },
          { id: 'competency', label: 'Competencies' },
          { id: 'employee-role', label: 'Employee Roles' },
          { id: 'role-competency-mapping', label: 'Role Competency Mappings' },
        ]
      },
    ];

    const managerItems = [
      { id: 'team-matrix', label: 'Team Matrix' },
      { id: 'team-assessments', label: 'Team Assessments' },
      { id: 'team-learning', label: 'Team Learning' },
    ];

    const employeeItems = [
      { id: 'my-profile', label: 'My Profile' },
      { id: 'my-assessments', label: 'My Assessments' },
      { id: 'my-learning', label: 'My Learning' },
    ];

    switch (userRole?.toLowerCase()) {
      case 'institutionadmin':
        return [...commonItems, ...adminItems];
      case 'manager':
        return [...commonItems, ...managerItems];
      case 'learner':
      default:
        return [...commonItems, ...employeeItems];
    }
  };

  const isActive = (itemId) => {
    const currentView = getCurrentView();
    return currentView === itemId || 
           (currentView === 'role-competency-mapping' && itemId === 'masters');
  };

  const renderNavItems = (items, level = 0) => {
    return items.map((item) => {
      const isItemActive = isActive(item.id);
      return (
        <div key={item.id} className="space-y-1">
          <div 
            className={`flex items-center justify-between rounded-md ${level > 0 ? 'pl-6' : ''} ${isItemActive ? 'bg-indigo-50' : ''}`}
            onClick={() => item.children ? toggleItem(item.id) : navigate(`/${userRole?.toLowerCase()}/${item.id}`)}
          >
            <NavItem
              label={item.label}
              active={isItemActive}
              icon={item.icon}
              onClick={(e) => {
                e.stopPropagation();
                if (!item.children) {
                  navigate(`/${userRole?.toLowerCase()}/${item.id}`);
                } else {
                  toggleItem(item.id);
                }
              }}
            />
            {item.children && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <svg 
                  className={`w-4 h-4 transform transition-transform ${expandedItems[item.id] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
          {item.children && (expandedItems[item.id] || isItemActive) && (
            <div className="mt-1 space-y-1">
              {renderNavItems(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {renderNavItems(getNavItems())}
        </div>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            // Handle logout
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 rounded-md hover:bg-red-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
