import React from 'react';
import KPI from './KPI';
import TeamCompetencyMatrix from './TeamCompetencyMatrix';
import TeamAssessments from './TeamAssessments';
import TeamLearningPaths from './TeamLearningPaths';

const ManagerDashboard = ({ employees = [], competencies = [], onSelectEmployee }) => {
  // Calculate team metrics
  const teamMembers = employees.length;
  const avgCompetency = competencies.length > 0
    ? (competencies.reduce((sum, comp) => {
        const levels = employees.map(e => e.competencies[comp.id] || 0);
        const avg = levels.length > 0 ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
        return sum + avg;
      }, 0) / competencies.length).toFixed(1)
    : 0;

  const assessmentsCompleted = Math.floor(employees.length * 0.65);
  const learningInProgress = Math.floor(employees.length * 0.45);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI 
          title="Team Members" 
          value={teamMembers} 
          sub="In your team" 
        />
        <KPI 
          title="Team Avg. Skill" 
          value={`${avgCompetency}/5`} 
          sub="Current quarter" 
        />
        <KPI 
          title="Assessments" 
          value={`${assessmentsCompleted}/${teamMembers}`} 
          sub="Completed" 
        />
        <KPI 
          title="Learning" 
          value={learningInProgress} 
          sub="In progress" 
        />
      </div>

      <TeamCompetencyMatrix 
        employees={employees} 
        competencies={competencies} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamAssessments 
          employees={employees} 
          onSelectEmployee={onSelectEmployee} 
        />
        <TeamLearningPaths 
          employees={employees} 
          onSelectEmployee={onSelectEmployee} 
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
