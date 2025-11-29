import React from 'react';
import ManagerDashboard from '../../components/dashboards/ManagerDashboard';

const ManagerDashboardPage = ({ employees, competencies, onSelectEmployee }) => {
  return (
    <ManagerDashboard
      employees={employees}
      competencies={competencies}
      onSelectEmployee={onSelectEmployee}
    />
  );
};

export default ManagerDashboardPage;
