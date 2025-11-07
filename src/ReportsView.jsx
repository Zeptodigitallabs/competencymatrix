import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
  BarController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
  BarController
);

const ReportsView = ({ employees, roles, competencies }) => {
  const [activeTab, setActiveTab] = useState('gap-analysis');
  const [filters, setFilters] = useState({
    department: 'all',
    level: 'all',
  });

  // Sample data for demonstration
  const departments = ['All', 'Engineering', 'Quality Assurance', 'Management'];
  const levels = ['All', 'Entry', 'Mid', 'Senior', 'Lead'];

  // Filter employees based on selected filters
  const filteredEmployees = employees.filter(emp => {
    const deptMatch = filters.department === 'all' || emp.dept === filters.department;
    // Add level filtering logic if needed
    return deptMatch;
  });

  // Calculate competency gaps for the gap analysis
  const calculateGaps = () => {
    // This is a simplified example - you would implement your actual gap calculation logic here
    return employees.map(employee => {
      const role = roles.find(r => r.name === employee.role) || {};
      const gaps = [];
      
      if (role.competencyLevels) {
        Object.entries(role.competencyLevels).forEach(([compId, requiredLevel]) => {
          const actualLevel = employee.competencies?.[compId] || 0;
          if (actualLevel < requiredLevel) {
            const competency = competencies.find(c => c.id === compId);
            if (competency) {
              gaps.push({
                competency: competency.name,
                requiredLevel,
                actualLevel,
                gap: requiredLevel - actualLevel
              });
            }
          }
        });
      }
      
      return {
        employee: employee.name,
        role: employee.role,
        department: employee.dept,
        totalGaps: gaps.length,
        criticalGaps: gaps.filter(g => g.gap > 2).length
      };
    });
  };

  // Generate heatmap data for competency vs role
  const generateHeatmapData = () => {
    try {
      // Ensure we have the required data
      if (!employees || !roles || !competencies || !Array.isArray(employees) || !Array.isArray(roles) || !Array.isArray(competencies)) {
        console.error('Invalid or missing data for heatmap');
        return { labels: [], datasets: [] };
      }

      const roleList = [...new Set(employees.map(e => e.role).filter(Boolean))];
      const compList = competencies.filter(Boolean).map(c => c.name).filter(Boolean);
      
      if (roleList.length === 0 || compList.length === 0) {
        console.error('No valid roles or competencies found');
        return { labels: compList, datasets: [] };
      }
      
      // Initialize data with zeros
      const data = roleList.map(role => {
        const roleData = roles.find(r => r && r.name === role)?.competencyLevels || {};
        return compList.map(comp => {
          const compId = competencies.find(c => c && c.name === comp)?.id;
          return compId ? (roleData[compId] || 0) : 0;
        });
      });

      return {
        labels: compList,
        datasets: roleList.map((role, i) => ({
          label: role || 'Unknown Role',
          data: data[i] || [],
          backgroundColor: (ctx) => {
            try {
              const value = ctx.raw || 0;
              const alpha = Math.min(1, Math.max(0, value / 5)); // Ensure alpha is between 0 and 1
              return `rgba(79, 70, 229, ${0.2 + alpha * 0.8})`;
            } catch (e) {
              console.error('Error generating background color:', e);
              return 'rgba(200, 200, 200, 0.5)';
            }
          },
          borderColor: 'rgba(79, 70, 229, 0.8)',
          borderWidth: 1,
        })),
      };
    } catch (error) {
      console.error('Error generating heatmap data:', error);
      return { labels: [], datasets: [] };
    }
  };

  // Generate trend data
  const generateTrendData = () => {
    // This would come from your actual time-series data in a real app
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      labels: months,
      datasets: [
        {
          type: 'line',
          label: 'Avg Proficiency',
          data: [2.8, 3.1, 3.3, 3.6, 3.8, 4.0],
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.5)',
          tension: 0.3,
          fill: true,
        },
        {
          type: 'bar',
          label: 'Gaps Closed',
          data: [8, 12, 15, 20, 25, 30],
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
        },
      ],
    };
  };

  // Check certification readiness
  const getCertificationReadiness = () => {
    return employees.map(employee => {
      const role = roles.find(r => r.name === employee.role);
      let ready = true;
      
      if (role?.competencyLevels) {
        for (const [compId, requiredLevel] of Object.entries(role.competencyLevels)) {
          if ((employee.competencies?.[compId] || 0) < requiredLevel) {
            ready = false;
            break;
          }
        }
      }
      
      return {
        ...employee,
        isReady: ready
      };
    });
  };

  // Calculate KPIs
  const calculateKPIs = () => {
    const readinessData = getCertificationReadiness();
    const totalEmployees = readinessData.length;
    const readyCount = readinessData.filter(e => e.isReady).length;
    const avgProficiency = employees.reduce((sum, emp) => {
      const levels = Object.values(emp.competencies || {});
      const avg = levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
      return sum + avg;
    }, 0) / Math.max(1, employees.length);

    return {
      avgProficiency: avgProficiency.toFixed(1),
      readinessPercent: totalEmployees ? Math.round((readyCount / totalEmployees) * 100) : 0,
      gapClosure: Math.min(100, Math.floor(Math.random() * 30) + 70), // Random for demo
      readinessIndex: Math.min(100, Math.floor(avgProficiency * 20)) // Scale 1-5 to 0-100
    };
  };

  const kpis = calculateKPIs();
  const gapData = calculateGaps();
  const heatmapData = generateHeatmapData();
  const trendData = generateTrendData();
  const readinessData = getCertificationReadiness();

  const handleExport = () => {
    // In a real app, this would generate and download a report
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'gap-analysis', name: 'Competency Gap Analysis' },
            { id: 'heatmaps', name: 'Heatmaps & Dashboards' },
            { id: 'trends', name: 'Trend Analysis' },
            { id: 'certification', name: 'Certification Readiness' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              className="border rounded-md px-3 py-2 text-sm w-48"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept.toLowerCase()}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              className="border rounded-md px-3 py-2 text-sm w-48"
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            >
              {levels.map((level) => (
                <option key={level} value={level.toLowerCase()}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Panels */}
        <div className="p-6">
          {/* Competency Gap Analysis */}
          {activeTab === 'gap-analysis' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Competency Gap Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500">Total Gaps Identified</p>
                  <p className="text-2xl font-semibold">
                    {gapData.reduce((sum, emp) => sum + emp.totalGaps, 0)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500">Critical Gaps</p>
                  <p className="text-2xl font-semibold text-red-600">
                    {gapData.reduce((sum, emp) => sum + emp.criticalGaps, 0)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500">Employees with Gaps</p>
                  <p className="text-2xl font-semibold">
                    {gapData.filter(emp => emp.totalGaps > 0).length}/{employees.length}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Gaps
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Critical Gaps
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gapData.map((emp) => (
                      <tr key={emp.employee} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{emp.employee}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{emp.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{emp.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            emp.totalGaps > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {emp.totalGaps} {emp.totalGaps === 1 ? 'gap' : 'gaps'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {emp.criticalGaps > 0 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {emp.criticalGaps} critical
                            </span>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h4 className="text-md font-medium mb-4">Competency vs Role Heatmap</h4>
                <div className="h-96">
                  <Chart
                    type="bar"
                    data={heatmapData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Competencies',
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Roles',
                          },
                        },
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              return `Level: ${context.raw}`;
                            },
                          },
                        },
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Heatmaps & Dashboards */}
          {activeTab === 'heatmaps' && (
            <div>
              <h3 className="text-lg font-medium mb-6">Organizational Competency Dashboard</h3>
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Avg. Proficiency</p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-semibold">{kpis.avgProficiency}</p>
                    <span className="ml-2 text-sm text-gray-500">/ 5.0</span>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-indigo-600 rounded-full" 
                        style={{ width: `${(kpis.avgProficiency / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Readiness %</p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-semibold">{kpis.readinessPercent}%</p>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${kpis.readinessPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Gap Closure</p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-semibold">{kpis.gapClosure}%</p>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${kpis.gapClosure}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Readiness Index</p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-semibold">{kpis.readinessIndex}</p>
                    <span className="ml-2 text-sm text-gray-500">/ 100</span>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-purple-500 rounded-full" 
                        style={{ width: `${kpis.readinessIndex}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h4 className="text-md font-medium mb-4">Department-wise Distribution</h4>
                  <div className="h-64">
                    <Chart
                      type="bar"
                      data={{
                        labels: departments.filter(d => d !== 'All'),
                        datasets: [{
                          label: 'Avg. Competency Level',
                          data: departments
                            .filter(d => d !== 'All')
                            .map(dept => {
                              const deptEmps = employees.filter(e => e.dept === dept);
                              if (deptEmps.length === 0) return 0;
                              const total = deptEmps.reduce((sum, emp) => {
                                const levels = Object.values(emp.competencies || {});
                                return sum + (levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : 0);
                              }, 0);
                              return total / deptEmps.length;
                            }),
                          backgroundColor: 'rgba(79, 70, 229, 0.7)',
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 5,
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h4 className="text-md font-medium mb-4">Competency Coverage</h4>
                  <div className="h-64">
                    <Chart
                      type="doughnut"
                      data={{
                        labels: competencies.map(c => c.name),
                        datasets: [{
                          data: competencies.map(comp => {
                            return employees.filter(emp => {
                              const role = roles.find(r => r.name === emp.role);
                              const requiredLevel = role?.competencyLevels?.[comp.id] || 0;
                              const actualLevel = emp.competencies?.[comp.id] || 0;
                              return actualLevel >= requiredLevel;
                            }).length;
                          }),
                          backgroundColor: [
                            'rgba(79, 70, 229, 0.7)',
                            'rgba(99, 102, 241, 0.7)',
                            'rgba(129, 140, 248, 0.7)',
                            'rgba(165, 180, 252, 0.7)',
                            'rgba(199, 210, 254, 0.7)',
                          ],
                        }],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                        },
                      }}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          )}

          {/* Trend Analysis */}
          {activeTab === 'trends' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Competency Trend Analysis</h3>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
                <h4 className="text-md font-medium mb-4">Competency Growth Over Time</h4>
                <div className="h-96">
                  <Chart
                    type="bar"
                    data={trendData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Value',
                          },
                        },
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += context.parsed.y;
                                if (context.dataset.label === 'Avg Proficiency') {
                                  label += ' / 5';
                                }
                              }
                              return label;
                            },
                          },
                        },
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h4 className="text-md font-medium mb-4">Top Competency Gaps</h4>
                  <div className="space-y-4">
                    {competencies.map((comp, index) => (
                      <div key={comp.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{comp.name}</span>
                          <span className="font-medium">
                            {Math.floor(Math.random() * 30) + 20}% gap
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, Math.floor(Math.random() * 50) + 20)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h4 className="text-md font-medium mb-4">Training Impact</h4>
                  <div className="h-64">
                    <Chart
                      type="line"
                      data={{
                        labels: ['Pre-Training', 'Post-Training', '3 Months After'],
                        datasets: [
                          {
                            label: 'Avg. Competency Level',
                            data: [2.5, 3.8, 3.5],
                            borderColor: 'rgba(79, 70, 229, 0.8)',
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            tension: 0.3,
                            fill: true,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 5,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Certification Readiness */}
          {activeTab === 'certification' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Certification Readiness</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                    All Certifications
                  </button>
                  <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md">
                    + Schedule Assessment
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target Certification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Readiness
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {readinessData.map((emp) => {
                      const role = roles.find(r => r.name === emp.role);
                      const isReady = emp.isReady;
                      const readinessScore = isReady ? 100 : Math.floor(Math.random() * 40) + 30;
                      
                      return (
                        <tr key={emp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">
                                  {emp.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                                <div className="text-sm text-gray-500">{emp.dept}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{emp.role}</div>
                            <div className="text-sm text-gray-500">{emp.dept}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {emp.role} Certification
                            </div>
                            <div className="text-xs text-gray-500">
                              {isReady ? 'All requirements met' : 'Some requirements pending'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    isReady ? 'bg-green-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${readinessScore}%` }}
                                ></div>
                              </div>
                              <span className={`text-sm font-medium ${
                                isReady ? 'text-green-600' : 'text-yellow-600'
                              }`}>
                                {isReady ? 'Ready' : `${readinessScore}%`}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {isReady ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Ready for Certification
                              </span>
                            ) : (
                              <>
                                <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                  View Gaps
                                </button>
                                <button className="text-gray-500 hover:text-gray-700">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h4 className="text-md font-medium mb-4">Certification Readiness by Department</h4>
                  <div className="h-64">
                    <Chart
                      type="bar"
                      data={{
                        labels: departments.filter(d => d !== 'All'),
                        datasets: [{
                          label: 'Readiness %',
                          data: departments
                            .filter(d => d !== 'All')
                            .map(dept => {
                              const deptEmps = readinessData.filter(e => e.dept === dept);
                              if (deptEmps.length === 0) return 0;
                              const readyCount = deptEmps.filter(emp => emp.isReady).length;
                              return Math.round((readyCount / deptEmps.length) * 100);
                            }),
                          backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                              display: true,
                              text: 'Readiness %',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h4 className="text-md font-medium mb-4">Certification Status</h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeDasharray={`${kpis.readinessPercent}, 100`}
                          strokeLinecap="round"
                        />
                        <text x="18" y="20.5" textAnchor="middle" className="text-2xl font-bold">
                          {kpis.readinessPercent}%
                        </text>
                        <text x="18" y="25.5" textAnchor="middle" className="text-xs text-gray-500">
                          Ready for Certification
                        </text>
                      </svg>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
