import React from 'react';
import EmployeesView from '../../components/employees/EmployeesView';

const EmployeesPage = ({ employees, onSelectEmployee }) => {
  return (
    <EmployeesView 
      employees={employees} 
      onSelectEmployee={onSelectEmployee} 
    />
  );
};

export default EmployeesPage;
