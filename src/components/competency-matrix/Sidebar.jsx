import React from 'react';
import NavItem from './NavItem';

const Sidebar = ({ view, setView, userRole }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'matrix', label: 'Competency Matrix' },
    { id: 'employees', label: 'Employees' },
  ];

  // Add admin-only views
  if (userRole === 'admin' || userRole === 'manager') {
    navItems.push(
      { id: 'competency-library', label: 'Competency Library' },
      { id: 'role-mapping', label: 'Role Mapping' },
      { id: 'reports', label: 'Reports' }
    );
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                active={view === item.id}
                onClick={() => setView(item.id)}
              />
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {userRole === 'admin' ? 'Admin' : userRole === 'manager' ? 'Manager' : 'User'}
              </p>
              <button className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                View profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
