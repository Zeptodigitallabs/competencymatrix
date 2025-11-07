import React, { useState } from 'react';
import { PlusIcon, SearchIcon } from '@heroicons/react/solid';
import { ChartBarIcon, BookOpenIcon, ClockIcon, CheckCircleIcon, UserCircleIcon, AcademicCapIcon, DocumentCheckIcon } from '@heroicons/react/outline';
import EmployeeProfile from './EmployeeProfile';
import EmployeeLearning from './EmployeeLearning';
import EmployeeAssessments from './EmployeeAssessments';

const EmployeeDashboard = ({ employees, competencies, onSelectEmployee }) => {
  // For demo purposes, we'll use the first employee as the current user
  const currentUser = employees && employees.length > 0 ? employees[0] : null;
  
  const [activeTab, setActiveTab] = useState('profile');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <EmployeeProfile employee={currentUser} />;
      case 'learning':
        return <EmployeeLearning />;
      case 'assessments':
        return <EmployeeAssessments />;
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Skills</h2>
            {currentUser.competencies?.length > 0 ? (
              <div className="space-y-4">
                {currentUser.competencies.map((competency, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{getCompetencyName(competency.competencyId)}</h3>
                      <span className="text-sm font-medium text-gray-700">Level {competency.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(competency.level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills assessed yet.</p>
            )}
          </div>
        );
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">No employee data available</p>
        </div>
      </div>
    );
  }

  const getCompetencyLevel = (competencyId) => {
    const competency = currentUser.competencies?.find(c => c.competencyId === competencyId);
    return competency ? competency.level : 0;
  };

  const getCompetencyName = (competencyId) => {
    if (!competencies) return competencyId;
    const competency = competencies.find(c => c.id === competencyId);
    return competency ? competency.name : competencyId;
  };

  const stats = [
    { 
      name: 'Skills Assessed', 
      value: currentUser.competencies?.length || 0, 
      icon: CheckCircleIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    { 
      name: 'Learning Paths', 
      value: currentUser.learningPath?.length || 0, 
      icon: BookOpenIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    { 
      name: 'Avg. Competency', 
      value: currentUser.competencies?.length 
        ? (currentUser.competencies.reduce((sum, c) => sum + c.level, 0) / currentUser.competencies.length).toFixed(1)
        : 0, 
      icon: ChartBarIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    { 
      name: 'Due for Review', 
      value: currentUser.competencies?.filter(c => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return new Date(c.lastAssessed) < threeMonthsAgo;
      }).length || 0,
      icon: ClockIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
            <p className="text-gray-600">Here's your personal dashboard</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Update Profile
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Assessments
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {activeTab === 'my-skills' && (
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">My Skills</h3>
            <div className="mt-4">
              {competencies && competencies.length > 0 ? (
                <div className="space-y-4">
                  {competencies.map((competency) => (
                    <div key={competency.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{competency.name}</h4>
                        <span className="text-sm text-gray-500">
                          Level {getCompetencyLevel(competency.id)} of {competency.levels}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{
                            width: `${(getCompetencyLevel(competency.id) / competency.levels) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Beginner</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills assessed yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'learning-paths' && (
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">My Learning Paths</h3>
            {currentUser.learningPath && currentUser.learningPath.length > 0 ? (
              <div className="mt-4 space-y-4">
                {currentUser.learningPath.map((competencyId, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <BookOpenIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">
                          {getCompetencyName(competencyId)}
                        </h4>
                        <div className="mt-2 flex space-x-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            In Progress
                          </span>
                          <span className="text-sm text-gray-500">
                            Started on {new Date().toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: '30%' }}
                            ></div>
                          </div>
                          <div className="mt-1 flex justify-between text-xs text-gray-500">
                            <span>30% Complete</span>
                            <span>3 of 10 modules</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-center py-12 bg-gray-50 rounded-lg">
                <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No learning paths</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any learning paths assigned yet.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Browse Learning Paths
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">My Assessments</h3>
            <div className="mt-4">
              {currentUser.competencies && currentUser.competencies.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {currentUser.competencies.map((competency, index) => {
                      const comp = competencies?.find(c => c.id === competency.competencyId);
                      if (!comp) return null;
                      
                      const lastAssessed = new Date(competency.lastAssessed);
                      const threeMonthsAgo = new Date();
                      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                      const isDue = lastAssessed < threeMonthsAgo;
                      
                      return (
                        <li key={index}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                {comp.name}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  isDue ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {isDue ? 'Due for Review' : 'Up to Date'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  Level {competency.level} of {comp.levels}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                <p>
                                  Last assessed on{' '}
                                  <time dateTime={competency.lastAssessed}>
                                    {new Date(competency.lastAssessed).toLocaleDateString()}
                                  </time>
                                </p>
                              </div>
                            </div>
                            {isDue && (
                              <div className="mt-3">
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Update Assessment
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any competency assessments yet.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Start Assessment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
