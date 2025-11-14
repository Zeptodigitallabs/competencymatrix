import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CompetencyLibraryPage from './pages/admin/CompetencyLibraryPage';
import ReportsPage from './pages/admin/ReportsPage';
import CompetencyCategoryMaster from './components/masters/CompetencyCategoryMaster';
import CompetencyMaster from './components/masters/CompetencyMaster';
import EmployeeRoleMaster from './components/masters/EmployeeRoleMaster';
import EmployeeRoleCompetencyMapping from './components/masters/EmployeeRoleCompetencyMapping';

// Manager Pages
import ManagerDashboardPage from './pages/manager/ManagerDashboard';
import TeamMatrixPage from './pages/manager/TeamMatrixPage';
import TeamAssessmentsPage from './pages/manager/TeamAssessmentsPage';
import TeamLearningPage from './pages/manager/TeamLearningPage';

// Learner Pages
import LearnerDashboard from './pages/learner/LearnerDashboard';
import MyProfilePage from './pages/learner/MyProfilePage';
import MyAssessmentsPage from './pages/learner/MyAssessmentsPage';
import MyLearningPage from './pages/learner/MyLearningPage';

// Shared Pages
import EmployeesPage from './pages/shared/EmployeesPage';

// Error Page
const NotFoundPage = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-gray-500">The requested page does not exist or you don't have permission to access it.</p>
    </div>
  </div>
);

const renderWithLayout = (Component, props, userRole) => (
  <AppLayout userRole={userRole}>
    <Component {...props} />
  </AppLayout>
);

export const renderRoutes = (props) => {
  const {
    userRole = 'Learner',
    employees = [],
    competencies = [],
    roles = [],
    onSelectEmployee,
    onAddCompetency,
    onEditCompetency,
    onDeleteCompetency,
    onSaveRoleMapping
  } = props;

  const commonProps = {
    employees,
    competencies,
    roles,
    onSelectEmployee: (employee, viewName) => onSelectEmployee?.(employee, viewName)
  };

  const adminProps = {
    ...commonProps,
    onAddCompetency,
    onEditCompetency,
    onDeleteCompetency,
    onSaveRoleMapping
  };

  return (
    <Routes>
      {/* Admin Routes */}
      {userRole === 'InstitutionAdmin' && (
        <Route path="/institutionadmin">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route 
            path="dashboard" 
            element={renderWithLayout(AdminDashboard, adminProps, 'InstitutionAdmin')} 
          />
          <Route 
            path="competency-library" 
            element={renderWithLayout(CompetencyLibraryPage, adminProps, 'InstitutionAdmin')} 
          />
          <Route 
            path="reports" 
            element={renderWithLayout(ReportsPage, adminProps, 'InstitutionAdmin')} 
          />
          <Route 
            path="employees" 
            element={<EmployeesPage {...commonProps} />} 
          />
          <Route 
            path="competency-category" 
            element={renderWithLayout(CompetencyCategoryMaster, adminProps, 'InstitutionAdmin')} 
          />
          <Route 
            path="competency" 
            element={renderWithLayout(CompetencyMaster, adminProps, 'InstitutionAdmin')} 
          />
          <Route 
            path="employee-role" 
            element={renderWithLayout(EmployeeRoleMaster, adminProps, 'InstitutionAdmin')} 
          />
          <Route 
            path="role-mapping" 
            element={renderWithLayout(EmployeeRoleCompetencyMapping, adminProps, 'InstitutionAdmin')} 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      )}

      {/* Manager Routes */}
      {userRole === 'Manager' && (
        <Route path="/manager">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route 
            path="dashboard" 
            element={renderWithLayout(ManagerDashboardPage, commonProps, 'Manager')} 
          />
          <Route 
            path="team-matrix" 
            element={renderWithLayout(TeamMatrixPage, commonProps, 'Manager')} 
          />
          <Route 
            path="team-assessments" 
            element={renderWithLayout(TeamAssessmentsPage, commonProps, 'Manager')} 
          />
          <Route 
            path="team-learning" 
            element={renderWithLayout(TeamLearningPage, commonProps, 'Manager')} 
          />
          <Route 
            path="employees" 
            element={<EmployeesPage {...commonProps} />} 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      )}

      {/* Learner/Employee Routes */}
      {userRole === 'Learner' && (
        <Route path="/learner">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route 
            path="dashboard" 
            element={renderWithLayout(LearnerDashboard, commonProps, 'Learner')} 
          />
          <Route 
            path="my-profile" 
            element={renderWithLayout(MyProfilePage, {}, 'Learner')} 
          />
          <Route 
            path="my-assessments" 
            element={renderWithLayout(MyAssessmentsPage, {}, 'Learner')} 
          />
          <Route 
            path="my-learning" 
            element={renderWithLayout(MyLearningPage, {}, 'Learner')} 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      )}
    </Routes>
  );
};

export default renderRoutes;
