import React from 'react';
import EmployeeDashboard from '../../components/dashboards/EmployeeDashboard';

const LearnerDashboard = ({ employees, competencies, onSelectEmployee }) => {
  return (
    <EmployeeDashboard
      employees={employees}
      competencies={competencies}
      onSelectEmployee={onSelectEmployee}
    />
  );
};

export default LearnerDashboard;
