import React, { useState, useEffect } from 'react';
import EmployeeService from '../../services/EmployeeService';
import DepartmentMasterService from '../../services/DepartmentMasterService';
import CompetencyService from '../../services/CompetencyService';
import { toast } from 'react-toastify';

const AdminReport = () => {
  const [filters, setFilters] = useState({
    employeeRoleId: '',
    departmentId: ''
  });
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch employee roles
        const rolesData = await EmployeeService.getEmployeeRoles();
        setRoles(rolesData);

        // Fetch departments
        const deptData = await DepartmentMasterService.getDepartmentList();
        setDepartments(deptData);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        toast.error('Failed to load filter options');
      }
    };

    fetchDropdownData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async () => {
    if (!filters.employeeRoleId || !filters.departmentId) {
      toast.warning('Please select both Employee Role and Department');
      return;
    }

    try {
      setLoading(true);
      const reportData = {
        institutionId: 35, // This should come from user's context
        empRoleId: parseInt(filters.employeeRoleId),
        deptId: parseInt(filters.departmentId)
      };
      
      const response = await CompetencyService.getAdminReport(reportData);
      if (response && response.data) {
        setReportData(response.data);
      } else {
        setReportData([]);
        toast.info('No data found for the selected filters');
      }
    } catch (error) {
      console.error('Error fetching admin report:', error);
      toast.error('Failed to fetch report data');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Filter Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Role
            </label>
            <select
              name="employeeRoleId"
              value={filters.employeeRoleId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.empRoleId} value={role.empRoleId}>
                  {role.empRoleName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              name="departmentId"
              value={filters.departmentId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.deptId} value={dept.deptId}>
                  {dept.deptName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : reportData.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Competencies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achieved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Gap
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalCompetenciesAssigned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.achieved}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.inProgress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.averageGap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No data available. Please select filters and click Search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
