import React from 'react';
import KPI from './KPI';
import TeamCompetencyMatrix from './TeamCompetencyMatrix';
import TeamAssessments from './TeamAssessments';
import TeamLearningPaths from './TeamLearningPaths';

const DashboardView = ({ employees = [], competencies = [], onSelectEmployee }) => {
  // Calculate dashboard metrics
  const totalEmployees = employees.length;
  const avgCompetency = competencies.length > 0
    ? (competencies.reduce((sum, comp) => {
        const levels = employees.map(e => e.competencies[comp.id] || 0);
        const avg = levels.length > 0 ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
        return sum + avg;
      }, 0) / competencies.length).toFixed(1)
    : 0;

  const assessmentsCompleted = Math.floor(employees.length * 0.75);
  const learningInProgress = Math.floor(employees.length * 0.6);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI 
          title="Total Employees" 
          value={totalEmployees} 
          sub="Across all departments" 
        />
        <KPI 
          title="Avg. Competency" 
          value={`${avgCompetency}/5`} 
          sub="Team average" 
        />
        <KPI 
          title="Assessments" 
          value={`${assessmentsCompleted}/${totalEmployees}`} 
          sub="Completed this quarter" 
        />
        <KPI 
          title="Learning In Progress" 
          value={learningInProgress} 
          sub="Active learning paths" 
        />
      </div>

      <TeamCompetencyMatrix 
        employees={employees} 
        competencies={competencies} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamAssessments employees={employees} />
        <TeamLearningPaths employees={employees} />
      </div>
    </div>
  );
};

export default DashboardView;
