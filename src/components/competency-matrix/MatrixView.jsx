import React from 'react';

const MatrixView = ({ employees, competencies, onCellClick }) => {
  if (!employees || !competencies) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available for the matrix view.</p>
      </div>
    );
  }

  const getCompetencyLevel = (employee, competencyId) => {
    const competency = employee.competencies?.find(c => c.competencyId === competencyId);
    return competency ? competency.level : 0;
  };

  const getLevelColor = (level, maxLevel = 5) => {
    if (level === 0) return 'bg-gray-100';
    const percentage = (level / maxLevel) * 100;
    if (percentage < 40) return 'bg-red-100';
    if (percentage < 70) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Competency Matrix</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and compare competency levels across the team
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10"
                >
                  Employee / Competency
                </th>
                {competencies.map((competency) => (
                  <th
                    key={competency.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex flex-col">
                      <span>{competency.name}</span>
                      <span className="text-xs font-normal text-gray-400">{competency.category}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
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
                  </td>
                  {competencies.map((competency) => {
                    const level = getCompetencyLevel(employee, competency.id);
                    return (
                      <td 
                        key={`${employee.id}-${competency.id}`} 
                        className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-50"
                        onClick={() => onCellClick && onCellClick(employee, competency)}
                      >
                        <div className="flex items-center">
                          <div className="w-full">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                {level > 0 ? `Level ${level}` : '—'}
                              </span>
                              <span className="text-gray-500">
                                {level > 0 ? `of ${competency.levels}` : ''}
                              </span>
                            </div>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getLevelColor(level, competency.levels)}`}
                                style={{
                                  width: level > 0 ? `${(level / competency.levels) * 100}%` : '0%',
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatrixView;
