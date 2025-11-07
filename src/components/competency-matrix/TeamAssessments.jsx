import React from 'react';

const TeamAssessments = ({ employees }) => {
  // Get the current date and calculate 3 months ago
  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  // Filter employees with assessments due (older than 3 months)
  const getDueAssessments = () => {
    return employees.flatMap(employee => {
      const dueCompetencies = employee.competencies
        .filter(comp => {
          const lastAssessed = new Date(comp.lastAssessed);
          return lastAssessed < threeMonthsAgo;
        })
        .map(comp => ({
          ...comp,
          employeeName: employee.name,
          employeeId: employee.id,
        }));
      return dueCompetencies;
    });
  };

  const dueAssessments = getDueAssessments();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Due Assessments</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Competency assessments that are due for renewal
        </p>
      </div>
      <div className="border-t border-gray-200">
        {dueAssessments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {dueAssessments.map((assessment, index) => (
              <li key={index}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {assessment.employeeName}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Due
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {assessment.competencyId}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p>
                        Last assessed on{' '}
                        <time dateTime={assessment.lastAssessed}>
                          {new Date(assessment.lastAssessed).toLocaleDateString()}
                        </time>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments due</h3>
            <p className="mt-1 text-sm text-gray-500">
              All competency assessments are up to date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamAssessments;
