import React from 'react';

const TeamAssessments = ({ employees = [], onSelectEmployee }) => {
  // Mock assessment data
  const assessments = [
    { 
      id: 1, 
      name: 'Q3 2023 Skills Assessment', 
      date: '2023-09-15', 
      status: 'Completed', 
      participants: employees.length 
    },
    { 
      id: 2, 
      name: 'Leadership Development Review', 
      date: '2023-06-20', 
      status: 'In Progress', 
      participants: Math.floor(employees.length * 0.7) 
    },
    { 
      id: 3, 
      name: 'Technical Skills Evaluation', 
      date: '2023-03-10', 
      status: 'Pending', 
      participants: 0 
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Assessments</h3>
        <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
          New Assessment
        </button>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{assessment.name}</h4>
                <div className="text-sm text-gray-500 mt-1">
                  Scheduled: {new Date(assessment.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Participants</div>
                  <div className="font-medium">
                    {assessment.participants}/{employees.length}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  assessment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  assessment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {assessment.status}
                </span>
              </div>
            </div>
            {assessment.status === 'In Progress' && (
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(assessment.participants / employees.length) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {Math.round((assessment.participants / employees.length) * 100)}% complete
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamAssessments;
