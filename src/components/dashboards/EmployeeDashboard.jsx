import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const EmployeeDashboard = ({ employees = [], competencies = [], onSelectEmployee = () => {} }) => {
  const navigate = useNavigate();
  
  // For demo, using the first employee as the current user
  const currentUser = employees?.[0] || { 
    name: 'User', 
    role: 'Employee', 
    dept: 'Department',
    competencies: {} 
  };

  // Add fallback empty object for competencies
  const userCompetencies = currentUser?.competencies || {};

  const topSkills = Object.entries(userCompetencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const skillGaps = Object.entries(userCompetencies)
    .filter(([_, level]) => level < 3)
    .sort((a, b) => a[1] - b[1]);

  // Prepare data for radar chart
  const radarData = {
    labels: competencies.map(comp => comp.name).slice(0, 5), // Show top 5 competencies
    datasets: [
      {
        label: 'Your Skills',
        data: competencies.slice(0, 5).map(comp => userCompetencies[comp.id] || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // If no user data is available yet, show a loading state
  if (!employees.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Competency Profile</h2>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{currentUser.name}</h3>
            <div className="text-gray-600">{currentUser.role} • {currentUser.dept}</div>
            <div className="mt-2 text-sm text-gray-500">
              Member since {new Date().getFullYear() - Math.floor(Math.random() * 5) + 2018}
            </div>
          </div>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={() => onSelectEmployee(currentUser)}
          >
            View Full Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">My Top Skills</h3>
          <div className="space-y-4">
            {topSkills.map(([skillId, level]) => {
              const skill = competencies.find(c => c.id === skillId);
              return (
                <div key={skillId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill?.name || 'Unknown Skill'}</span>
                    <span className="text-gray-500">Level {level}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(level / 5) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Skill Gaps</h3>
          {skillGaps.length > 0 ? (
            <div className="space-y-4">
              {skillGaps.map(([skillId, level]) => {
                const skill = competencies.find(c => c.id === skillId);
                return (
                  <div key={skillId} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill?.name || 'Unknown Skill'}</span>
                      <span className="text-gray-500">Level {level}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No significant skill gaps identified. Keep up the good work!
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4">Skill Radar</h3>
        <div className="h-80">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Recommended Learning</h3>
          <div className="space-y-3">
            {skillGaps.slice(0, 3).map(([skillId]) => {
              const skill = competencies.find(c => c.id === skillId);
              return (
                <div key={skillId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span>{skill?.name || 'Skill Development'}</span>
                  <button 
                    onClick={() => navigate('/learning')}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View Courses
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Upcoming Assessments</h3>
          <div className="space-y-3">
            {competencies.slice(0, 2).map(comp => (
              <div key={comp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span>{comp.name} Assessment</span>
                <span className="text-sm text-gray-500">Due in 7 days</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
