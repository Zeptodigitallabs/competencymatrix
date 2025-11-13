import React, { useState, useEffect } from 'react';

const CompetencyModal = ({ 
  competency, 
  onClose, 
  onSave,
  onDelete
}) => {
  const [localCompetency, setLocalCompetency] = useState(competency || {
    name: '',
    category: 'Technical',
    levels: 5,
    linkedRoles: []
  });

  useEffect(() => {
    if (competency) {
      setLocalCompetency(competency);
    } else {
      setLocalCompetency({
        name: '',
        category: 'Technical',
        levels: 5,
        linkedRoles: []
      });
    }
  }, [competency]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localCompetency);
  };

  const handleRoleChange = (e) => {
    const roles = e.target.value.split(',').map(r => r.trim()).filter(Boolean);
    setLocalCompetency(prev => ({
      ...prev,
      linkedRoles: roles
    }));
  };

  if (!competency) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">
            {competency.id ? 'Edit Competency' : 'Add New Competency'}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={localCompetency.name}
              onChange={(e) => setLocalCompetency(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={localCompetency.category}
              onChange={(e) => setLocalCompetency(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Leadership">Leadership</option>
              <option value="Domain">Domain</option>
              <option value="Process">Process</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Levels (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={localCompetency.levels || 5}
              onChange={(e) => setLocalCompetency(prev => ({ 
                ...prev, 
                levels: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) 
              }))}
              className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Linked Roles (comma separated)
            </label>
            <input
              type="text"
              value={Array.isArray(localCompetency.linkedRoles) ? localCompetency.linkedRoles.join(', ') : localCompetency.linkedRoles || ''}
              onChange={handleRoleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., Frontend Developer, Backend Developer"
            />
          </div>
          
          <div className="pt-4 flex justify-between">
            <div>
              {competency.id && (
                <button
                  type="button"
                  onClick={() => onDelete && onDelete(competency.id)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {competency.id ? 'Update' : 'Create'} Competency
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetencyModal;
