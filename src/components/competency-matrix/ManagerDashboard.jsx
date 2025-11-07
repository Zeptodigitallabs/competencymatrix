import React, { useState } from 'react';
import { PlusIcon, SearchIcon } from '@heroicons/react/solid';
import KPI from './KPI';
import TeamCompetencyMatrix from './TeamCompetencyMatrix';
import TeamAssessments from './TeamAssessments';
import TeamLearningPaths from './TeamLearningPaths';

const ManagerDashboard = ({ employees, competencies, onSelectEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');

  // Get unique departments and roles for filters
  const departments = ['All', ...new Set(employees.map(emp => emp.department))];
  const roles = ['All', ...new Set(employees.map(emp => emp.role))];

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || employee.department === selectedDepartment;
    const matchesRole = selectedRole === 'All' || employee.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const stats = [
    { title: 'Team Members', value: employees.length, sub: 'Total team size' },
    { 
      title: 'Avg. Competency Level', 
      value: '3.8', 
      sub: 'Out of 5.0' 
    },
    { 
      title: 'Due Assessments', 
      value: employees.reduce((count, emp) => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return count + emp.competencies.filter(c => new Date(c.lastAssessed) < threeMonthsAgo).length;
      }, 0),
      sub: 'Past due date' 
    },
    { 
      title: 'Learning Paths', 
      value: employees.reduce((count, emp) => count + (emp.learningPath?.length || 0), 0),
      sub: 'In progress' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manager Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your team's competencies and development progress
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Assessment
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <select
              id="department"
              name="department"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <select
              id="role"
              name="role"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <KPI
            key={index}
            title={stat.title}
            value={stat.value}
            sub={stat.sub}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <TeamCompetencyMatrix 
          employees={filteredEmployees} 
          competencies={competencies} 
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TeamAssessments employees={filteredEmployees} />
          <TeamLearningPaths 
            employees={filteredEmployees} 
            competencies={competencies} 
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
