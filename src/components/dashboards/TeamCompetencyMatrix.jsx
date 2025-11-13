import React from 'react';

const TeamCompetencyMatrix = ({ employees = [], competencies = [] }) => {
  // Calculate average competency levels
  const calculateAverages = () => {
    return competencies.map(competency => {
      const levels = employees.map(employee => employee.competencies[competency.id] || 0);
      const sum = levels.reduce((a, b) => a + b, 0);
      const avg = levels.length > 0 ? sum / levels.length : 0;
      return {
        ...competency,
        average: parseFloat(avg.toFixed(1)),
        total: sum,
        count: levels.filter(level => level > 0).length
      };
    });
  };

  const competencyAverages = calculateAverages();
  
  // Sort by average level (highest first)
  const sortedCompetencies = [...competencyAverages].sort((a, b) => b.average - a.average);

  // Get top 5 competencies
  const topCompetencies = sortedCompetencies.slice(0, 5);

  // Calculate overall team competency
  const overallAverage = competencyAverages.length > 0
    ? (competencyAverages.reduce((sum, comp) => sum + comp.average, 0) / competencyAverages.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Team Competency Overview</h3>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Overall Average</div>
            <div className="text-2xl font-bold text-indigo-600">{overallAverage}/5</div>
          </div>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            View Full Matrix
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {topCompetencies.map((competency) => (
          <div key={competency.id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{competency.name}</span>
              <span className="text-gray-500">
                {competency.average.toFixed(1)}/5 • {competency.count} of {employees.length} team members
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${(competency.average / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {competencies.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-indigo-600 hover:text-indigo-800">
            + {competencies.length - 5} more competencies
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamCompetencyMatrix;
