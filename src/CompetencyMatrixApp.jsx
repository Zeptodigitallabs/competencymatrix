import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Topbar from './components/common/Topbar/Topbar';
import Sidebar from './components/common/Sidebar/Sidebar';
import DashboardView from './components/dashboards/DashboardView';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import EmployeeDashboard from './components/dashboards/EmployeeDashboard';
import EmployeesView from './components/employees/EmployeesView';
import EmployeeModal from './components/employees/EmployeeModal';
import CompetencyLibraryView from "./components/competency-library/CompetencyLibraryView.jsx";
import RoleCompetencyMapping from "./components/role-competency-mapping/RoleCompetencyMapping.jsx";
import ReportsView from "./components/reports/ReportsView.jsx";
import EmployeeAssessments from "./components/competency-matrix/EmployeeAssessments";
import EmployeeLearning from "./components/competency-matrix/EmployeeLearning";
import EmployeeProfile from "./components/competency-matrix/EmployeeProfile";
import CompetencyCategoryMaster from "./components/masters/CompetencyCategoryMaster";
import CompetencyMaster from "./components/masters/CompetencyMaster";
import EmployeeRoleMaster from "./components/masters/EmployeeRoleMaster";
import EmployeeRoleCompetencyMapping from "./components/masters/EmployeeRoleCompetencyMapping";
import TeamCompetencyMatrix from "./components/team/TeamCompetencyMatrix";
import TeamAssessments from "./components/team/TeamAssessments";
import TeamLearningPaths from "./components/team/TeamLearningPaths";
import CompetencyModal from "./components/competency-library/CompetencyModal";

// Competency Matrix - Single-file React + Tailwind clickable prototype
// Default export: CompetencyMatrixApp
// Usage: drop into a CRA/Vite React app with Tailwind configured.

const SAMPLE_COMPETENCIES = [
  {
    id: "c1",
    name: "JavaScript",
    category: "Technical",
    levels: 5,
    linkedRoles: ["Frontend Engineer", "Fullstack Engineer"]
  },
  {
    id: "c2",
    name: "React",
    category: "Technical",
    levels: 5,
    linkedRoles: ["Frontend Engineer", "Fullstack Engineer"]
  },
  {
    id: "c3",
    name: "Communication",
    category: "Behavioral",
    levels: 5,
    linkedRoles: ["All"]
  },
  {
    id: "c4",
    name: "Problem Solving",
    category: "Behavioral",
    levels: 5,
    linkedRoles: ["All"]
  },
  {
    id: "c5",
    name: "Unit Testing",
    category: "Technical",
    levels: 5,
    linkedRoles: ["QA Engineer", "Frontend Engineer"]
  },
];

// Sample roles with their competency requirements
const SAMPLE_ROLES = [
  {
    id: "r1",
    name: "Frontend Engineer",
    department: "Engineering",
    competencyLevels: {
      c1: 4, // JavaScript
      c2: 3, // React
      c3: 3, // Communication
      c4: 3, // Problem Solving
      c5: 2  // Unit Testing
    }
  },
  {
    id: "r2",
    name: "Backend Engineer",
    department: "Engineering",
    competencyLevels: {
      c1: 4, // JavaScript/Node.js
      c3: 3, // Communication
      c4: 4  // Problem Solving
    }
  },
  {
    id: "r3",
    name: "QA Engineer",
    department: "Quality Assurance",
    competencyLevels: {
      c3: 3, // Communication
      c4: 3, // Problem Solving
      c5: 4  // Unit Testing
    }
  },
  {
    id: "r4",
    name: "Engineering Manager",
    department: "Engineering",
    competencyLevels: {
      c3: 5, // Communication
      c4: 5  // Problem Solving
    }
  }
];

const SAMPLE_EMPLOYEES = [
  {
    id: "e1",
    name: "Aishwarya Rao",
    role: "Frontend Engineer",
    dept: "Engineering",
    competencies: { c1: 4, c2: 3, c3: 5, c4: 3, c5: 2 },
  },
  {
    id: "e2",
    name: "Pranav Sharma",
    role: "Fullstack Engineer",
    dept: "Engineering",
    competencies: { c1: 5, c2: 4, c3: 4, c4: 4, c5: 3 },
  },
  {
    id: "e3",
    name: "Riya Patel",
    role: "QA Engineer",
    dept: "Quality",
    competencies: { c1: 2, c2: 2, c3: 4, c4: 3, c5: 5 },
  },
];

function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}




function CompetencyMatrixApp({ userRole = 'Learner' }) {
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [cellDetail, setCellDetail] = useState(null);
  
  // Get user data from Redux store
  const { userInfo, loading, error } = useSelector(state => ({
    userInfo: state.user?.userInfo,
    loading: state.user?.loading,
    error: state.user?.error
  }));
  const [employees, setEmployees] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [roles, setRoles] = useState([]);
  
  // Initialize data when userInfo is loaded
  useEffect(() => {
    if (loading) return; // Don't do anything while loading
    
    if (error) {
      console.error('Error loading user data:', error);
      // Fallback to sample data on error
      setEmployees(SAMPLE_EMPLOYEES);
      setCompetencies(SAMPLE_COMPETENCIES);
      setRoles(SAMPLE_ROLES);
      return;
    }

    if (userInfo) {
      // Use actual user data if available, otherwise fall back to sample data
      setEmployees(userInfo.employees || SAMPLE_EMPLOYEES);
      setCompetencies(userInfo.competencies || SAMPLE_COMPETENCIES);
      setRoles(userInfo.roles || SAMPLE_ROLES);
    } else {
      // Fallback to sample data if no user data is available
      setEmployees(SAMPLE_EMPLOYEES);
      setCompetencies(SAMPLE_COMPETENCIES);
      setRoles(SAMPLE_ROLES);
    }
  }, [userInfo, loading, error]);

  const handleCellClick = (employee, competency, level) => {
    // open modal for editing employee competency
    setSelectedEmployee({ ...employee });
  };

  const updateEmployee = (updated) => {
    setEmployees((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddCompetency = () => {
    // Generate a new ID for the competency
    const newId = `c${competencies.length + 1}`;
    const newCompetency = {
      id: newId,
      name: "New Competency",
      category: "Technical",
      levels: 5,
      linkedRoles: []
    };
    setCompetencies(prev => [...prev, newCompetency]);
    setSelectedCompetency(newCompetency);
  };

  const handleUpdateCompetency = (updated) => {
    setCompetencies(prev =>
      prev.map(comp => comp.id === updated.id ? updated : comp)
    );
    setSelectedCompetency(null);
  };

  const handleDeleteCompetency = (id) => {
    if (window.confirm('Are you sure you want to delete this competency?')) {
      setCompetencies(prev => prev.filter(comp => comp.id !== id));
    }
  };

  const handleSaveRoleMapping = (roleId, competencyLevels) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === roleId
          ? { ...role, competencyLevels: { ...competencyLevels } }
          : role
      )
    );
  };

  return (
    <div className="h-screen flex bg-gray-50 font-sans text-gray-800">
      {sidebarOpen && <Sidebar view={view} setView={setView} userRole={userRole} />}

      <div style={{ overflow: 'auto' }} className="flex-1 flex flex-col">
        <Topbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="flex-1 overflow-auto">
          {view === "dashboard" && userRole === 'InstitutionAdmin' && (
            <DashboardView 
              employees={employees} 
              competencies={competencies} 
              onSelectEmployee={(e) => { 
                setSelectedEmployee(e); 
                setView('employees'); 
              }} 
            />
          )}
          {view === "dashboard" && userRole === 'Manager' && (
            <ManagerDashboard
              employees={employees}
              competencies={competencies}
              onSelectEmployee={(e) => {
                setSelectedEmployee(e);
                setView('employees');
              }}
            />
          )}
          {view === "dashboard" && userRole === 'Learner' && (
            <EmployeeDashboard
              employees={employees}
              competencies={competencies}
              onSelectEmployee={(e) => setSelectedEmployee(e)}
            />
          )}
          {view === "employees" && (
            <EmployeesView employees={employees} onSelectEmployee={(e) => setSelectedEmployee(e)} />
          )}

          {/* placeholders for other views */}
          {view === "frameworks" && (
            <div className="p-6">Frameworks management placeholder</div>
          )}
          {view === "reports" && (
            <ReportsView
              employees={employees}
              roles={roles}
              competencies={competencies}
            />
          )}
          {view === "competency-category" && <CompetencyCategoryMaster />}
          {view === "competency-master" && <CompetencyMaster />}
          {view === "employee-role-master" && <EmployeeRoleMaster />}
          {view === "employee-role-competency-mapping" && <EmployeeRoleCompetencyMapping />}
          {view === "role-mapping" && (
            <RoleCompetencyMapping
              roles={roles}
              competencies={competencies}
              onSaveMapping={handleSaveRoleMapping}
            />
          )}
          {view === "competency-library" && (
            <CompetencyLibraryView
              competencies={competencies}
              onAddCompetency={handleAddCompetency}
              onEditCompetency={setSelectedCompetency}
              onDeleteCompetency={handleDeleteCompetency}
            />
          )}
          {view === "team-matrix" && (
            <TeamCompetencyMatrix employees={employees} competencies={competencies} />
          )}
          {view === "assessments" && (
            <TeamAssessments employees={employees} />
          )}
          {view === "learning-paths" && (
            <TeamLearningPaths employees={employees} competencies={competencies} />
          )}
          {view === "my-assessments" && (
            <div className="bg-white p-6 rounded-lg shadow-sm"><EmployeeAssessments/></div>
          )}
          {view === "my-learning" && (
            <div className="bg-white p-6 rounded-lg shadow-sm"><EmployeeLearning/></div>
          )}
        </main>
      </div>

      {/* Employee modal */}
      {selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdate={(u) => updateEmployee(u)}
        />
      )}

      {/* Competency Modal */}
      {selectedCompetency && (
        <CompetencyModal
          competency={selectedCompetency}
          onClose={() => setSelectedCompetency(null)}
          onSave={(updatedCompetency) => {
            // Handle save logic here
            const updatedCompetencies = competencies.map(c => 
              c.id === updatedCompetency.id ? updatedCompetency : c
            );
            setCompetencies(updatedCompetencies);
            setSelectedCompetency(null);
          }}
          onDelete={(competencyId) => {
            // Handle delete logic here
            const updatedCompetencies = competencies.filter(c => c.id !== competencyId);
            setCompetencies(updatedCompetencies);
            setSelectedCompetency(null);
          }}
        />
      )}
    </div>
  );
}

export default CompetencyMatrixApp;
