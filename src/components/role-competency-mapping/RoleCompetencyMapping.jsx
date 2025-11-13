import React, { useState, useEffect } from 'react';

function RoleCompetencyMapping({ roles, competencies, onSaveMapping }) {
  const [searchRole, setSearchRole] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [competencyLevels, setCompetencyLevels] = useState({});
  const [isModified, setIsModified] = useState(false);

  // Initialize competency levels when role changes
  useEffect(() => {
    if (selectedRole) {
      const initialLevels = {};
      competencies.forEach(comp => {
        initialLevels[comp.id] = selectedRole.competencyLevels?.[comp.id] || 0;
      });
      setCompetencyLevels(initialLevels);
      setIsModified(false);
    }
  }, [selectedRole, competencies]);

  // Filter roles based on search
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchRole.toLowerCase())
  );

  const handleLevelChange = (competencyId, level) => {
    setCompetencyLevels(prev => ({
      ...prev,
      [competencyId]: level
    }));
    setIsModified(true);
  };

  const handleSave = () => {
    if (selectedRole) {
      onSaveMapping(selectedRole.id, competencyLevels);
      setIsModified(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Role-Competency Mapping</h2>
        <p className="text-sm text-gray-500">
          Map competency levels to each role in your organization
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane - Role List */}
        <div className="w-1/3 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search roles..."
                className="w-full px-3 py-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedRole?.id === role.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <h3 className="font-medium">{role.name}</h3>
                <p className="text-sm text-gray-500">
                  {Object.keys(role.competencyLevels || {}).length} competencies mapped
                </p>
              </div>
            ))}
            {filteredRoles.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No roles found
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Competency Mapping */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedRole ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">{selectedRole.name}</h3>
                <p className="text-sm text-gray-600">
                  Set the required competency levels for this role
                </p>
              </div>

              <div className="space-y-6">
                {competencies.map((competency) => (
                  <div key={competency.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-medium">{competency.name}</h4>
                        <p className="text-sm text-gray-500">{competency.category}</p>
                      </div>
                      <div className="text-lg font-medium">
                        {competencyLevels[competency.id] || 0}
                      </div>
                    </div>
                    <div className="mt-2">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={competencyLevels[competency.id] || 0}
                        onChange={(e) => handleLevelChange(competency.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0 - Not Required</span>
                        <span>5 - Expert</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium">Select a role to view or edit its competency requirements</h3>
                <p className="mt-1 text-sm">
                  Or create a new role to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Save Button */}
      <div className="border-t p-4 bg-gray-50 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isModified || !selectedRole}
          className={`px-4 py-2 rounded-md text-white ${
            isModified && selectedRole
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Save Mapping
        </button>
      </div>
    </div>
  );
}

export default RoleCompetencyMapping;
