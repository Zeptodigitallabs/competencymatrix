import React from 'react';

const TeamCompetencyMatrix = ({ employees, competencies }) => {
  const getCompetencyLevel = (employee, competencyId) => {
    const competency = employee.competencies.find(c => c.competencyId === competencyId);
    return competency ? competency.level : 0;
  };

  const getLevelClass = (level, maxLevel = 5) => {
    if (level === 0) return 'bg-gray-100';
    const percentage = (level / maxLevel) * 100;
    if (percentage < 40) return 'bg-red-100';
    if (percentage < 70) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Team Competency Matrix</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Current competency levels across the team
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Employee
                </th>
                {competencies.map((competency) => (
                  <th
                    key={competency.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {competency.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.name}
                  </td>
                  {competencies.map((competency) => (
                    <td key={`${employee.id}-${competency.id}`} className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${getLevelClass(
                            getCompetencyLevel(employee, competency.id),
                            competency.levels
                          )}`}
                          style={{
                            width: `${(getCompetencyLevel(employee, competency.id) / competency.levels) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Level {getCompetencyLevel(employee, competency.id)} of {competency.levels}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamCompetencyMatrix;
