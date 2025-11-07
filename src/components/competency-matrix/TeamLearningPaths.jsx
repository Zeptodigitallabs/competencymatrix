import React, { useState } from 'react';

const TeamLearningPaths = ({ employees, competencies }) => {
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  const toggleEmployee = (employeeId) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
  };

  const getCompetencyName = (competencyId) => {
    if (!competencies) return competencyId;
    const competency = competencies.find(c => c.id === competencyId);
    return competency ? competency.name : competencyId;
  };

  if (!employees) return null;
  
  const employeesWithLearningPaths = employees.filter(
    employee => employee.learningPath && employee.learningPath.length > 0
  );

  if (employeesWithLearningPaths.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Team Learning Paths</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            No active learning paths assigned to team members.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Team Learning Paths</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Active learning paths for team members
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {employeesWithLearningPaths.map((employee) => (
            <li key={employee.id} className="hover:bg-gray-50">
              <div 
                className="px-4 py-4 sm:px-6 cursor-pointer"
                onClick={() => toggleEmployee(employee.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-800 font-medium">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.role}</div>
                    </div>
                  </div>
                  <div className={`ml-2 flex-shrink-0 flex ${expandedEmployee === employee.id ? 'rotate-180' : ''}`}>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {expandedEmployee === employee.id && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Path:</h4>
                    <ul className="space-y-2">
                      {employee.learningPath.map((competencyId, index) => (
                        <li key={index} className="ml-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-gray-700">
                                {getCompetencyName(competencyId)}
                              </p>
                              <div className="mt-1">
                                <a
                                  href="#"
                                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  View resources <span aria-hidden="true">&rarr;</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update Progress
                      </button>
                      <button
                        type="button"
                        className="ml-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit Path
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamLearningPaths;
