import React, { useState, useEffect } from 'react';

const EmployeeModal = ({ employee, onClose, onUpdate }) => {
  const [local, setLocal] = useState(employee);
  
  useEffect(() => {
    setLocal(employee);
  }, [employee]);

  if (!employee) return null;

  const setLevel = (cid, val) => {
    setLocal(prev => ({
      ...prev,
      competencies: {
        ...prev.competencies,
        [cid]: val
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">
            {employee.name}'s Competency Profile
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={local.name || ''}
                onChange={(e) => setLocal(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={local.role || ''}
                onChange={(e) => setLocal(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={local.department || ''}
                onChange={(e) => setLocal(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={local.email || ''}
                onChange={(e) => setLocal(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Competency Levels</h4>
            <div className="space-y-3">
              {Object.entries(local.competencies || {}).map(([compId, level]) => {
                const competency = employee.allCompetencies?.find(c => c.id === compId) || { name: compId };
                return (
                  <div key={compId} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 w-1/3 truncate">{competency.name}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setLevel(compId, lvl)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            lvl <= level ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
