import React from 'react';
import { UserCircleIcon, PhoneIcon, BriefcaseIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/outline';

const EmployeeProfile = ({ employee }) => {
  if (!employee) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-6 mb-8">
        <UserCircleIcon className="h-20 w-20 text-gray-400" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
          <p className="text-gray-600">{employee.role}</p>
          <p className="text-sm text-gray-500">Employee ID: {employee.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              
              <span className="text-gray-700">{employee.email || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">{employee.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Work Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">{employee.department || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Manager: {employee.manager || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Hire Date: {employee.hireDate || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
        <p className="text-gray-600">
          {employee.bio || 'No additional information available.'}
        </p>
      </div>
    </div>
  );
};

export default EmployeeProfile;
