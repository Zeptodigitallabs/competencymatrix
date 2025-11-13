import React from 'react';

const TeamLearningPaths = ({ employees = [], onSelectEmployee }) => {
  // Mock learning paths data
  const learningPaths = [
    {
      id: 1,
      name: 'Frontend Mastery',
      skills: ['React', 'TypeScript', 'CSS'],
      enrolled: Math.floor(employees.length * 0.6),
      completed: Math.floor(employees.length * 0.3),
      avgProgress: 52,
    },
    {
      id: 2,
      name: 'Leadership Essentials',
      skills: ['Communication', 'Coaching', 'Strategy'],
      enrolled: Math.floor(employees.length * 0.4),
      completed: Math.floor(employees.length * 0.1),
      avgProgress: 28,
    },
    {
      id: 3,
      name: 'Cloud Certification',
      skills: ['AWS', 'DevOps', 'Security'],
      enrolled: Math.floor(employees.length * 0.3),
      completed: Math.floor(employees.length * 0.05),
      avgProgress: 15,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Learning Paths</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            View All
          </button>
          <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Create Path
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {learningPaths.map((path) => (
          <div key={path.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{path.name}</h4>
                <div className="flex flex-wrap gap-1 mt-2">
                  {path.skills.map(skill => (
                    <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Enrolled</div>
                <div className="font-medium">{path.enrolled} members</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Progress</span>
                <span>{path.avgProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${path.avgProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{path.completed} completed</span>
                <span>{path.enrolled - path.completed} in progress</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamLearningPaths;
