import React, { useState } from 'react';
import { CheckCircleIcon, ClockIcon, XCircleIcon, ArrowRightIcon, ChartBarIcon } from '@heroicons/react/outline';

const assessments = [
  {
    id: 1,
    title: 'Frontend Technical Assessment',
    type: 'Technical',
    status: 'completed',
    score: 85,
    date: '2023-10-15',
    skillsAssessed: ['JavaScript', 'React', 'CSS'],
    timeSpent: '45 min',
    maxScore: 100,
  },
  {
    id: 2,
    title: 'Problem Solving Test',
    type: 'Behavioral',
    status: 'in-progress',
    progress: 60,
    date: '2023-11-01',
    dueDate: '2023-11-30',
    timeSpent: '25 min',
    timeLimit: '60 min',
  },
  {
    id: 3,
    title: 'Communication Skills Evaluation',
    type: 'Behavioral',
    status: 'not-started',
    date: '2023-12-01',
    dueDate: '2023-12-15',
    timeLimit: '30 min',
  },
];

const AssessmentCard = ({ assessment, onStartAssessment }) => {
  const getStatusBadge = () => {
    switch (assessment.status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{assessment.title}</h3>
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-sm text-gray-500">{assessment.type}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">
              {assessment.status === 'completed' 
                ? `Completed on ${new Date(assessment.date).toLocaleDateString()}`
                : `Due ${new Date(assessment.dueDate).toLocaleDateString()}`}
            </span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {assessment.status === 'completed' && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Score</span>
            <span className="text-sm font-bold text-gray-900">
              {assessment.score}/{assessment.maxScore} ({Math.round((assessment.score / assessment.maxScore) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${(assessment.score / assessment.maxScore) * 100}%` }}
            ></div>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Assessed</h4>
            <div className="flex flex-wrap gap-2">
              {assessment.skillsAssessed.map((skill, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {assessment.status === 'in-progress' && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-gray-900">{assessment.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-yellow-400 h-2.5 rounded-full" 
              style={{ width: `${assessment.progress}%` }}
            ></div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>Time spent: {assessment.timeSpent} of {assessment.timeLimit}</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        {assessment.status === 'not-started' ? (
          <button 
            onClick={() => onStartAssessment(assessment.id)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Assessment
            <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4" />
          </button>
        ) : assessment.status === 'in-progress' ? (
          <button 
            onClick={() => onStartAssessment(assessment.id)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Assessment
            <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4" />
          </button>
        ) : (
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            View Results
            <ChartBarIcon className="ml-2 -mr-1 h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const EmployeeAssessments = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const filteredAssessments = assessments.filter(assessment => {
    if (activeTab === 'all') return true;
    return assessment.status === activeTab;
  });

  const handleStartAssessment = (assessmentId) => {
    const assessment = assessments.find(a => a.id === assessmentId);
    setSelectedAssessment(assessment);
    setShowStartModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Assessments</h2>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { name: 'All', value: 'all', count: assessments.length },
              { name: 'Not Started', value: 'not-started', count: assessments.filter(a => a.status === 'not-started').length },
              { name: 'In Progress', value: 'in-progress', count: assessments.filter(a => a.status === 'in-progress').length },
              { name: 'Completed', value: 'completed', count: assessments.filter(a => a.status === 'completed').length },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`${activeTab === tab.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                      activeTab === tab.value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {filteredAssessments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No assessments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'all' 
              ? 'You don\'t have any assessments yet.' 
              : `You don't have any ${activeTab.replace('-', ' ')} assessments.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssessments.map(assessment => (
            <AssessmentCard 
              key={assessment.id} 
              assessment={assessment} 
              onStartAssessment={handleStartAssessment} 
            />
          ))}
        </div>
      )}

      {/* Start Assessment Modal */}
      {showStartModal && selectedAssessment && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowStartModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckCircleIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Start {selectedAssessment.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        This assessment will test your knowledge in various areas. Make sure you have enough time to complete it.
                      </p>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Time Limit:</span> {selectedAssessment.timeLimit || 'No time limit'}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Questions:</span> {selectedAssessment.questions || 'Multiple choice and practical'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Handle start assessment logic
                    setShowStartModal(false);
                  }}
                >
                  Start Assessment
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowStartModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAssessments;
