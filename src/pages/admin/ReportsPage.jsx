import React from 'react';
import ReportsView from '../../components/reports/ReportsView';

const ReportsPage = ({ employees, roles, competencies }) => {
  return (
    <ReportsView
      employees={employees}
      roles={roles}
      competencies={competencies}
    />
  );
};

export default ReportsPage;
