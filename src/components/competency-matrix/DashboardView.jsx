import React from 'react';
import KPI from './KPI';
import TeamCompetencyMatrix from './TeamCompetencyMatrix';
import TeamAssessments from './TeamAssessments';
import TeamLearningPaths from './TeamLearningPaths';

const DashboardView = ({ employees, competencies, onSelectEmployee }) => {
  const stats = [
    { title: 'Team Members', value: employees.length, sub: 'Total team size' },
    { 
      title: 'Avg. Competency Level', 
      value: '3.2', 
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your team's competencies and development progress
        </p>
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
        <TeamCompetencyMatrix employees={employees} competencies={competencies} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TeamAssessments employees={employees} />
          <TeamLearningPaths employees={employees} competencies={competencies} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
