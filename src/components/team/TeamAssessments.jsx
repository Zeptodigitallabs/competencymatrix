import React from 'react';

const TeamAssessments = ({ employees }) => {
  // Calculate assessment statistics
  const completedAssessments = employees.filter(e => e.lastAssessment).length;
  const completionRate = (completedAssessments / employees.length) * 100;
  
  // Get recent assessments
  const recentAssessments = employees
    .filter(e => e.lastAssessment)
    .sort((a, b) => new Date(b.lastAssessment) - new Date(a.lastAssessment))
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-4">Team Assessments</h3>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Team Members</div>
          <div className="text-2xl font-bold">{employees.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Completed</div>
          <div className="text-2xl font-bold">{completedAssessments}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Completion Rate</div>
          <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
        </div>
      </div>

      {/* Recent Assessments */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">RECENT ASSESSMENTS</h4>
        <div className="space-y-2">
          {recentAssessments.length > 0 ? (
            recentAssessments.map(emp => (
              <div key={emp.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{emp.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(emp.lastAssessment).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {emp.role}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No recent assessments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamAssessments;
