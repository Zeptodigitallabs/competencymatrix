import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Topbar from './components/common/Topbar/Topbar';
import Sidebar from './components/common/Sidebar/Sidebar';
import DashboardView from './components/dashboards/DashboardView';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import EmployeeDashboard from './components/dashboards/EmployeeDashboard';
import EmployeesView from './components/employees/EmployeesView';
import CompetencyLibraryView from "./components/competency-library";
import RoleCompetencyMapping from "./RoleCompetencyMapping";
import ReportsView from "./ReportsView";
import EmployeeAssessments from "./components/competency-matrix/EmployeeAssessments";
import EmployeeLearning from "./components/competency-matrix/EmployeeLearning";
import EmployeeProfile from "./components/competency-matrix/EmployeeProfile";
import CompetencyCategoryMaster from "./components/masters/CompetencyCategoryMaster";
import CompetencyMaster from "./components/masters/CompetencyMaster";
import EmployeeRoleMaster from "./components/masters/EmployeeRoleMaster";
import EmployeeRoleCompetencyMapping from "./components/masters/EmployeeRoleCompetencyMapping";

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


function TeamCompetencyMatrix({ employees, competencies }) {
  // Calculate average competency levels for the team
  const teamAverages = competencies.map(comp => {
    const levels = employees
      .map(emp => emp.competencies[comp.id] || 0)
      .filter(level => level > 0);

    const avg = levels.length > 0
      ? (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(1)
      : 0;

    return {
      ...comp,
      average: parseFloat(avg),
      employeesAtLevel: [1, 2, 3, 4, 5].map(level =>
        employees.filter(emp => Math.floor(emp.competencies[comp.id] || 0) === level).length
      )
    };
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Competency Matrix</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            Export
          </button>
          <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Run Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Competency</th>
              <th className="text-center py-2">Avg. Level</th>
              <th colSpan="5" className="text-center py-2">Employees by Proficiency Level</th>
              <th className="text-right py-2 px-3">Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {teamAverages.map((comp) => (
              <tr key={comp.id} className="hover:bg-gray-50">
                <td className="py-3 px-3 font-medium">{comp.name}</td>
                <td className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${comp.average >= 4 ? 'bg-green-100 text-green-800' :
                    comp.average >= 2.5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {comp.average}/5.0
                  </span>
                </td>
                {[1, 2, 3, 4, 5].map((level, i) => (
                  <td key={level} className="text-center py-3">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium">{comp.employeesAtLevel[i]}</span>
                      <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${level <= 2 ? 'bg-red-400' :
                            level <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                            }`}
                          style={{
                            width: `${(comp.employeesAtLevel[i] / employees.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </td>
                ))}
                <td className="text-right px-3">
                  <span className="text-sm text-gray-500">
                    {Math.max(0, (4 - comp.average).toFixed(1))} to target
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamAssessments({ employees }) {
  // Mock assessment data
  const assessments = [
    { id: 1, name: 'Q3 2023 Skills Assessment', date: '2023-09-15', status: 'Completed', participants: employees.length },
    { id: 2, name: 'Leadership Development Review', date: '2023-06-20', status: 'In Progress', participants: Math.floor(employees.length * 0.7) },
    { id: 3, name: 'Technical Skills Evaluation', date: '2023-03-10', status: 'Pending', participants: 0 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Assessments</h3>
        <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
          New Assessment
        </button>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{assessment.name}</h4>
                <div className="text-sm text-gray-500 mt-1">
                  Scheduled: {new Date(assessment.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Participants</div>
                  <div className="font-medium">
                    {assessment.participants}/{employees.length}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${assessment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  assessment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {assessment.status}
                </span>
              </div>
            </div>
            {assessment.status === 'In Progress' && (
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(assessment.participants / employees.length) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {Math.round((assessment.participants / employees.length) * 100)}% complete
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamLearningPaths({ employees }) {
  // Mock learning paths data
  const learningPaths = [
    {
      id: 1,
      name: 'Frontend Mastery',
      skills: ['React', 'TypeScript', 'CSS'],
      enrolled: Math.floor(employees.length * 0.6),
      completed: Math.floor(employees.length * 0.3),
      avgProgress: 52,
    },
    {
      id: 2,
      name: 'Leadership Essentials',
      skills: ['Communication', 'Coaching', 'Strategy'],
      enrolled: Math.floor(employees.length * 0.4),
      completed: Math.floor(employees.length * 0.1),
      avgProgress: 28,
    },
    {
      id: 3,
      name: 'Cloud Certification',
      skills: ['AWS', 'DevOps', 'Security'],
      enrolled: Math.floor(employees.length * 0.3),
      completed: Math.floor(employees.length * 0.05),
      avgProgress: 15,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Learning Paths</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            View All
          </button>
          <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Create Path
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {learningPaths.map((path) => (
          <div key={path.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium">{path.name}</h4>
            <div className="flex flex-wrap gap-1 mt-2 mb-3">
              {path.skills.map(skill => (
                <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Enrolled</span>
                  <span className="font-medium">{path.enrolled} members</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(path.enrolled / employees.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium">{path.completed} completed</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${path.avgProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {path.avgProgress}% average progress
                </div>
              </div>
            </div>

            <button className="mt-4 w-full py-2 text-sm border rounded-md hover:bg-gray-50">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


function EmployeeModal({ employee, onClose, onUpdate }) {
  const [local, setLocal] = useState(employee);
  if (!employee) return null;

  const setLevel = (cid, val) => {
    setLocal((s) => ({ ...s, competencies: { ...s.competencies, [cid]: val } }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{employee.name} — Competency Profile</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Role</div>
            <div className="font-semibold">{employee.role}</div>
            <div className="mt-4 text-sm text-gray-500">Department</div>
            <div className="font-semibold">{employee.dept}</div>

            <div className="mt-6">
              <h4 className="font-semibold">Actions</h4>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1 bg-indigo-600 text-white rounded">Assign Learning Path</button>
                <button className="px-3 py-1 bg-green-600 text-white rounded">Mark Verified</button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Competencies</h4>
            <div className="mt-2 space-y-2">
              {Object.entries(local.competencies).map(([cid, lvl]) => (
                <div key={cid} className="flex items-center gap-3">
                  <div className="w-28 text-sm">{cid}</div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    value={lvl}
                    onChange={(e) => setLevel(cid, Number(e.target.value))}
                    className="flex-1"
                  />
                  <div className="w-8 text-center">{lvl}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { onUpdate(local); onClose(); }} className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
              <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
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

      {/* Competency Modal - You can implement this similarly to EmployeeModal */}
      {selectedCompetency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Edit Competency</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedCompetency.name}
                  onChange={(e) => setSelectedCompetency({ ...selectedCompetency, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={selectedCompetency.category}
                  onChange={(e) => setSelectedCompetency({ ...selectedCompetency, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Leadership">Leadership</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedCompetency(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateCompetency(selectedCompetency)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompetencyMatrixApp;
