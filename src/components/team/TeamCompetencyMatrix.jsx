import React from 'react';

const TeamCompetencyMatrix = ({ employees, competencies }) => {
  // Calculate average competency levels
  const getAverageLevel = (competencyId) => {
    const levels = employees
      .map(emp => emp.competencies[competencyId] || 0)
      .filter(l => l > 0);
    
    if (levels.length === 0) return 0;
    return (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-4">Team Competency Overview</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Strength</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {competencies.map((comp) => {
              const avgLevel = getAverageLevel(comp.id);
              return (
                <tr key={comp.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{comp.name}</div>
                    <div className="text-sm text-gray-500">{comp.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-2 bg-gray-200 rounded-full w-32 mr-2">
                        <div 
                          className="h-2 bg-indigo-600 rounded-full" 
                          style={{ width: `${(avgLevel / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{avgLevel}/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {employees.filter(e => e.competencies[comp.id] >= 3).length} of {employees.length} team members
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamCompetencyMatrix;
