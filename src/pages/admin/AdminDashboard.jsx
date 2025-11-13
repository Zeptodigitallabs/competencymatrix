import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardView from '../../components/dashboards/DashboardView';

const AdminDashboard = ({ employees, competencies, onSelectEmployee }) => {
  const navigate = useNavigate();
  
  const handleSelectEmployee = (employee) => {
    if (onSelectEmployee) onSelectEmployee(employee, 'employees');
  };

  return (
    <DashboardView 
      employees={employees} 
      competencies={competencies} 
      onSelectEmployee={handleSelectEmployee}
    />
  );
};

export default AdminDashboard;
