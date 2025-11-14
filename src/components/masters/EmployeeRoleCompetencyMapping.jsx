import React, { useState, useEffect } from 'react';
import RoleCompetencyService from '../../services/RoleCompetencyService';
import EmployeeService from '../../services/EmployeeService';
import CompetencyService from '../../services/CompetencyService';

const EmployeeRoleCompetencyMapping = () => {
  const [mappings, setMappings] = useState([]);
  const [roles, setRoles] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  const [formData, setFormData] = useState({
    roleId: '',
    competencyId: '',
    isActive: true
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching role competency mapping data...');
      setIsLoading(true);
      
      // Fetch all necessary data in parallel
      const [mappingsData, rolesData, competenciesData] = await Promise.all([
        RoleCompetencyService.getRoleCompetencyMappings(),
        EmployeeService.getEmployeeRoles(),
        CompetencyService.getCompetencies()
      ]);

      console.log('Raw data from API:', { mappingsData, rolesData, competenciesData });
      
      // Process and set the data
      const processedMappings = Array.isArray(mappingsData) ? mappingsData : [];
      const processedRoles = Array.isArray(rolesData) ? rolesData : [];
      const processedCompetencies = Array.isArray(competenciesData) ? competenciesData : [];
      
      console.log('Processed data:', { 
        mappings: processedMappings, 
        roles: processedRoles, 
        competencies: processedCompetencies 
      });
      
      setMappings(processedMappings);
      setRoles(processedRoles);
      setCompetencies(processedCompetencies);
      
      if (processedRoles.length === 0) {
        console.warn('No roles found in the response');
      }
      if (processedCompetencies.length === 0) {
        console.warn('No competencies found in the response');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load data';
      setError(errorMessage);
      console.error('Error in fetchData:', {
        message: err.message,
        response: err.response,
        stack: err.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingMapping(null);
    setFormData({
      roleId: '',
      competencyId: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (mapping) => {
    setEditingMapping(mapping);
    setFormData({
      roleId: mapping.roleId,
      competencyId: mapping.competencyId,
      isActive: mapping.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (roleId, competencyId) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      try {
        setIsLoading(true);
        await RoleCompetencyService.deleteRoleCompetencyMapping(roleId, competencyId);
        setMappings(prev => prev.filter(m => 
          !(m.roleId === roleId && m.competencyId === competencyId)
        ));
      } catch (err) {
        setError('Failed to delete mapping');
        console.error('Error deleting mapping:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const savedMapping = await RoleCompetencyService.saveRoleCompetencyMapping(formData);
      
      setMappings(prev => {
        // Remove existing mapping if editing
        const filtered = prev.filter(m => 
          !(m.roleId === formData.roleId && m.competencyId === formData.competencyId)
        );
        return [...filtered, { ...savedMapping }];
      });
      
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save mapping');
      console.error('Error saving mapping:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper function to get role/competency name by ID
  const getRoleName = (roleId) => {
    const role = roles.find(r => r.roleId === roleId);
    return role ? role.roleName : 'Unknown Role';
  };

  const getCompetencyName = (competencyId) => {
    const competency = competencies.find(c => c.competencyId === competencyId);
    return competency ? competency.competencyName : 'Unknown Competency';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-500">⚠️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Role Competency Mapping</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add Mapping
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mappings.length > 0 ? (
                mappings.map((mapping, index) => (
                  <tr key={`${mapping.roleId}-${mapping.competencyId}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getRoleName(mapping.roleId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCompetencyName(mapping.competencyId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mapping.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {mapping.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(mapping)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(mapping.roleId, mapping.competencyId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No role-competency mappings found. Click "Add Mapping" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingMapping ? 'Edit Mapping' : 'Add New Mapping'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!!editingMapping}
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Competency <span className="text-red-500">*</span>
                </label>
                <select
                  name="competencyId"
                  value={formData.competencyId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!!editingMapping}
                >
                  <option value="">Select Competency</option>
                  {competencies.map(comp => (
                    <option key={comp.competencyId} value={comp.competencyId}>
                      {comp.competencyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRoleCompetencyMapping;
