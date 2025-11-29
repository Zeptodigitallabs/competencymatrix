import React from 'react';

const EmployeesView = ({ employees, onSelectEmployee }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <button className="px-3 py-1 bg-indigo-600 text-white rounded">+ Add Employee</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((e) => (
          <div 
            key={e.id} 
            className="p-4 bg-white rounded shadow-sm cursor-pointer hover:shadow transition-shadow"
            onClick={() => onSelectEmployee(e)}
          >
            <div className="font-semibold">{e.name}</div>
            <div className="text-xs text-gray-500">{e.role}</div>
            <div className="mt-2 text-sm">
              Competency avg: {Math.round(
                Object.values(e.competencies).reduce((a, b) => a + b, 0) / 
                Object.values(e.competencies).length
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesView;
