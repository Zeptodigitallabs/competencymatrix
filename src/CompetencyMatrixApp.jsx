import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import CompetencyLibraryView from "./CompetencyLibraryView";
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

function Topbar({ onToggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Competency Matrix</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">Organization: Acme Learning</div>
        {/* <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
          Create Framework
        </button> */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, userRole }) {
  const [expandedItems, setExpandedItems] = React.useState({});

  const toggleItem = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard' },
    ];

    const adminItems = [
      { id: 'competency-library', label: 'Competency Management' },
      { id: 'role-mapping', label: 'Role Mappings' },
      { id: 'reports', label: 'Reports & Analytics' },
      { 
        id: 'masters', 
        label: 'Masters',
        children: [
          { id: 'competency-category', label: 'Competency Categories' },
          { id: 'competency-master', label: 'Competency Master' },
          { id: 'employee-role-master', label: 'Employee Role Master' },
          { id: 'employee-role-competency-mapping', label: 'Role Competency Mapping' }
        ]
      },
    ];

    const managerItems = [
      { id: 'team-matrix', label: 'Team Competency Matrix' },
      { id: 'assessments', label: 'Team Assessments' },
      { id: 'learning-paths', label: 'Learning Paths' },
    ];

    const employeeItems = [
      { id: 'my-learning', label: 'My Learning' },
      { id: 'my-assessments', label: 'My Assessments' },
    ];

    let items = [...commonItems];

    if (userRole === 'InstitutionAdmin') {
      items = [...items, ...adminItems];
    } else if (userRole === 'Manager') {
      items = [...items, ...managerItems];
    } else {
      items = [...items, ...employeeItems];
    }

    return items;
  };
  return (
    <aside className="w-64 border-r bg-white p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-indigo-500 rounded flex items-center justify-center text-white font-bold">AL</div>
        <div>
          <div className="font-semibold">Acme Learning</div>
          <div className="text-xs text-gray-500">Competency Module</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {getNavItems().map((item) => (
          <div key={item.id}>
            <div 
              className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer ${view === item.id || (item.children && item.children.some(child => view === child.id)) ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
              onClick={() => item.children ? toggleItem(item.id) : setView(item.id)}
            >
              <div className="flex items-center gap-3">
                <IconGrid />
                <span>{item.label}</span>
              </div>
              {item.children && (
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedItems[item.id] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
            {item.children && expandedItems[item.id] && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map(child => (
                  <div
                    key={child.id}
                    className={`px-3 py-2 text-sm rounded cursor-pointer ${view === child.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setView(child.id);
                    }}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded ${active ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"}`}
    >
      <IconGrid />
      <span>{label}</span>
    </button>
  );
}

function KPI({ title, value, sub }) {
  return (
    <div className="p-3 bg-white rounded shadow-sm">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub && <div className="text-sm text-gray-400">{sub}</div>}
    </div>
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

function DashboardView({ employees, competencies, onSelectEmployee }) {
  // compute average competency gap (simple example)
  const avg = Math.round(
    employees.reduce((acc, e) => {
      const vals = Object.values(e.competencies);
      const target = 4; // assume role target
      const gaps = vals.reduce((s, v) => s + Math.max(0, target - v), 0) / vals.length;
      return acc + gaps;
    }, 0) / employees.length
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <KPI title="Avg. Gap (per emp)" value={`${avg}`} sub="Lower is better" />
        <KPI title="Employees" value={employees.length} />
        <KPI title="Competencies" value={competencies.length} />
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Team Snapshot</h3>
          <div className="text-sm text-gray-500">Updated: today</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {employees.map((e) => (
            <div key={e.id} className="p-3 border rounded hover:shadow cursor-pointer" onClick={() => onSelectEmployee(e)}>
              <div className="font-semibold">{e.name}</div>
              <div className="text-xs text-gray-500">{e.role} — {e.dept}</div>
              <div className="mt-2 text-sm">Top: {Object.entries(e.competencies).sort((a, b) => b[1] - a[1])[0][0]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard({ employees, competencies, onSelectEmployee }) {
  // Calculate team statistics
  const teamStats = employees.reduce((acc, emp) => {
    const levels = Object.values(emp.competencies || {});
    const avgLevel = levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;

    acc.totalCompetencies += levels.length;
    acc.totalProficiency += avgLevel;

    // Count employees at different proficiency levels
    if (avgLevel >= 4) acc.highProficiency++;
    else if (avgLevel >= 2.5) acc.mediumProficiency++;
    else acc.lowProficiency++;

    return acc;
  }, {
    totalCompetencies: 0,
    totalProficiency: 0,
    highProficiency: 0,
    mediumProficiency: 0,
    lowProficiency: 0
  });

  const avgProficiency = employees.length > 0
    ? (teamStats.totalProficiency / employees.length).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Team Competency Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPI title="Team Members" value={employees.length} sub="Total employees" />
        <KPI title="Avg. Proficiency" value={avgProficiency} sub="Out of 5" />
        <KPI title="Total Skills Tracked" value={teamStats.totalCompetencies} sub="Across team" />
      </div>

      <div className="space-y-6">
        {/* <TeamCompetencyMatrix employees={employees} competencies={competencies} /> */}

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamAssessments employees={employees} />
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Proficiency Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{teamStats.highProficiency}</div>
                <div className="text-sm text-green-600">High Proficiency</div>
                <div className="text-xs text-green-500">4.0+ rating</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">{teamStats.mediumProficiency}</div>
                <div className="text-sm text-yellow-600">Medium Proficiency</div>
                <div className="text-xs text-yellow-500">2.5 - 3.9 rating</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{teamStats.lowProficiency}</div>
                <div className="text-sm text-red-600">Needs Development</div>
                <div className="text-xs text-red-500">Below 2.5 rating</div>
              </div>
            </div>
          </div>

          <TeamLearningPaths employees={employees} />

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">Click to view details</div>
                <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  Add Team Member
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectEmployee(emp)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{emp.name}</div>
                      <div className="text-sm text-gray-500">{emp.role}</div>
                    </div>
                    <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {emp.dept}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">Top Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(emp.competencies)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([skill, level]) => (
                          <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {skill}: {level}/5
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>*/}
      </div>
    </div>
  );
}

function EmployeeDashboard({ employees, competencies, onSelectEmployee }) {
  // For demo, using the first employee as the current user
  const currentUser = employees[0];

  const topSkills = Object.entries(currentUser.competencies || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const skillGaps = Object.entries(currentUser.competencies || {})
    .filter(([_, level]) => level < 3)
    .sort((a, b) => a[1] - b[1]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Competency Profile</h2>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{currentUser.name}</h3>
            <div className="text-gray-600">{currentUser.role} • {currentUser.dept}</div>
            <div className="mt-2 text-sm text-gray-500">
              Member since {new Date().getFullYear() - Math.floor(Math.random() * 5) + 2018}
            </div>
          </div>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={() => onSelectEmployee(currentUser)}
          >
            View Full Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">My Top Skills</h3>
          <div className="space-y-4">
            {topSkills.map(([skill, level]) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill}</span>
                  <span className="font-medium">{level}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(level / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Skill Gaps</h3>
          {skillGaps.length > 0 ? (
            <div className="space-y-3">
              {skillGaps.map(([skill, level]) => (
                <div key={skill} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="font-medium text-yellow-800">{skill}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs text-yellow-600">Current: {level}/5</div>
                    <div className="text-xs text-gray-400">•</div>
                    <div className="text-xs text-gray-500">Target: 3.0+</div>
                  </div>
                  <button className="mt-2 text-xs text-blue-600 hover:underline">
                    View learning resources
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No critical skill gaps identified. Keep up the good work!
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4">Recommended Learning Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Advanced JavaScript', 'React Performance', 'Team Leadership'].map((course) => (
            <div key={course} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="font-medium">{course}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.floor(Math.random() * 5) + 1} hours • {['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)]}
              </div>
              <button className="mt-3 text-sm text-blue-600 hover:underline">
                Start Learning →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Competency Profile</h2>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{currentUser.name}</h3>
            <div className="text-gray-600">{currentUser.role} • {currentUser.dept}</div>
            <div className="mt-2 text-sm text-gray-500">
              Member since {new Date().getFullYear() - Math.floor(Math.random() * 5) + 2018}
            </div>
          </div>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={() => onSelectEmployee(currentUser)}
          >
            View Full Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">My Top Skills</h3>
          <div className="space-y-4">
            {topSkills.map(([skill, level]) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill}</span>
                  <span className="font-medium">{level}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(level / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Skill Gaps</h3>
          {skillGaps.length > 0 ? (
            <div className="space-y-3">
              {skillGaps.map(([skill, level]) => (
                <div key={skill} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="font-medium text-yellow-800">{skill}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs text-yellow-600">Current: {level}/5</div>
                    <div className="text-xs text-gray-400">•</div>
                    <div className="text-xs text-gray-500">Target: 3.0+</div>
                  </div>
                  <button className="mt-2 text-xs text-blue-600 hover:underline">
                    View learning resources
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No critical skill gaps identified. Keep up the good work!
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4">Recommended Learning Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Advanced JavaScript', 'React Performance', 'Team Leadership'].map((course) => (
            <div key={course} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="font-medium">{course}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.floor(Math.random() * 5) + 1} hours • {['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)]}
              </div>
              <button className="mt-3 text-sm text-blue-600 hover:underline">
                Start Learning →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatrixView({ employees, competencies, onCellClick }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Competency Matrix</h2>
        <div className="flex items-center gap-2">
          <input className="border px-2 py-1 rounded" placeholder="Search employee" />
          <button className="px-3 py-1 bg-indigo-600 text-white rounded">Export</button>
        </div>
      </div>

      <div className="overflow-auto bg-white rounded shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-3 text-left">Employee</th>
              {competencies.map((c) => (
                <th key={c.id} className="py-3 px-3 text-left">{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-3">{e.name}<div className="text-xs text-gray-400">{e.role}</div></td>
                {competencies.map((c) => {
                  const level = e.competencies[c.id] ?? 0;
                  const color = level >= 4 ? "bg-green-100" : level >= 3 ? "bg-yellow-100" : "bg-red-100";
                  return (
                    <td key={c.id} className="py-3 px-3">
                      <button onClick={() => onCellClick(e, c, level)} className={`px-2 py-1 rounded ${color} border`}>{level}</button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmployeesView({ employees, onSelectEmployee }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <button className="px-3 py-1 bg-indigo-600 text-white rounded">+ Add Employee</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {employees.map((e) => (
          <div key={e.id} className="p-4 bg-white rounded shadow-sm cursor-pointer hover:shadow" onClick={() => onSelectEmployee(e)}>
            <div className="font-semibold">{e.name}</div>
            <div className="text-xs text-gray-500">{e.role}</div>
            <div className="mt-2 text-sm">Competency avg: {Math.round(Object.values(e.competencies).reduce((a, b) => a + b, 0) / Object.values(e.competencies).length)}</div>
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded w-full max-w-2xl p-6">
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
            <DashboardView employees={employees} competencies={competencies} onSelectEmployee={(e) => { setSelectedEmployee(e); setView('employees'); }} />
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
          {view === "matrix" && (
            <MatrixView employees={employees} competencies={competencies} onCellClick={handleCellClick} />
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
