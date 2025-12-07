import React, { useState } from 'react';
import AdminReport from './AdminReport';

const ReportsViewV1 = () => {
  const [activeTab, setActiveTab] = useState('admin-report');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">View and analyze competency reports</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('admin-report')}
              className={`${
                activeTab === 'admin-report'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Admin Report
            </button>
          </nav>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'admin-report' && <AdminReport />}
      </div>
    </div>
  );
};

export default ReportsViewV1;
