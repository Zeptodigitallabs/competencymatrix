import React from 'react';
import { BookOpenIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/outline';

const learningPaths = [
  {
    id: 1,
    title: 'Frontend Development Mastery',
    description: 'Master modern frontend development with React, TypeScript, and related technologies.',
    progress: 65,
    courses: [
      { id: 1, title: 'Advanced React Patterns', status: 'completed', duration: '4h 30m' },
      { id: 2, title: 'TypeScript Fundamentals', status: 'in-progress', duration: '3h 15m' },
      { id: 3, title: 'State Management with Redux', status: 'not-started', duration: '5h 0m' },
    ],
    dueDate: '2023-12-31',
  },
  {
    id: 2,
    title: 'Agile Project Management',
    description: 'Learn agile methodologies and project management best practices.',
    progress: 30,
    courses: [
      { id: 4, title: 'Scrum Fundamentals', status: 'in-progress', duration: '2h 45m' },
      { id: 5, title: 'Agile Requirements', status: 'not-started', duration: '3h 0m' },
    ],
    dueDate: '2024-01-15',
  },
];

const LearningCard = ({ path }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{path.title}</h3>
          <p className="text-gray-600 mt-1">{path.description}</p>
        </div>
        <div className="flex items-center">
          <div className="h-2.5 w-32 bg-gray-200 rounded-full mr-2">
            <div 
              className="h-2.5 rounded-full bg-blue-600" 
              style={{ width: `${path.progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">{path.progress}%</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {path.courses.map(course => (
          <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              {course.status === 'completed' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
              ) : course.status === 'in-progress' ? (
                <div className="h-5 w-5 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-3"></div>
              )}
              <span className={course.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}>
                {course.title}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{course.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span>Due: {new Date(path.dueDate).toLocaleDateString()}</span>
        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
          Continue Learning <ArrowRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

const EmployeeLearning = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Learning</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Browse Learning Paths
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <BookOpenIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Learning Paths</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Courses Completed</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-4">Active Learning Paths</h3>
      {learningPaths.map(path => (
        <LearningCard key={path.id} path={path} />
      ))}

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Advanced CSS & Sass', 'React Performance Optimization', 'Testing React Applications'].map((course, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <BookOpenIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h4 className="font-medium">{course}</h4>
              <p className="text-sm text-gray-500 mt-1">4.5 ★ (128 reviews)</p>
              <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Start Learning <ArrowRightIcon className="h-3 w-3 inline" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLearning;
