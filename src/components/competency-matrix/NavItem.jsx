import React from 'react';

const NavItem = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      active
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {label}
  </button>
);

export default NavItem;
