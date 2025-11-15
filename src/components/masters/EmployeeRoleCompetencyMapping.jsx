import React, { useState, useEffect } from 'react';
import RoleCompetencyService from '../../services/RoleCompetencyService';
import EmployeeService from '../../services/EmployeeService';
import CompetencyService from '../../services/CompetencyService';
// Add this import at the top of your file
import { useSelector } from 'react-redux';


// Notification component for showing success/error messages
const Notification = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-md ${type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    } shadow-lg z-50`}>
    <div className="flex">
      <div className="flex-shrink-0">
        {type === 'success' ? '✅' : '⚠️'}
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="ml-4">
        <button
          type="button"
          className="inline-flex rounded-md focus:outline-none"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <span className="text-gray-400 hover:text-gray-500">✕</span>
        </button>
      </div>
    </div>
  </div>
);

const EmployeeRoleCompetencyMapping = () => {

  // Inside your component, before the handleSubmit function:
  const userInfo = useSelector(state => state.user?.userInfo);
  const institutionId = userInfo?.institutionId;

  const [mappings, setMappings] = useState([]);
  const [roles, setRoles] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    roleId: '',
    competencyId: '',
    minLevel: 1,
    maxLevel: 5,
    isActive: true
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchMappings();
  }, []);

  // Fetch role-competency mappings
  const fetchMappings = async () => {
    try {
      setIsLoading(true);
      const data = await RoleCompetencyService.getRoleCompetencyMappings();
      setMappings(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error('Error fetching mappings:', err);
      setError('Failed to fetch role-competency mappings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  // Fetch roles and competencies in parallel
  const fetchRolesAndCompetencies = async () => {
    try {
      setIsLoading(true);
      const [rolesData, competenciesData] = await Promise.all([
        EmployeeService.getEmployeeRoles(),
        CompetencyService.getCompetencies()
      ]);

      // Process roles
      const processedRoles = (Array.isArray(rolesData) ? rolesData : []).map(role => ({
        ...role,
        roleId: role.roleId || role.empRoleId
      }));
      setRoles(processedRoles);

      // Process competencies
      const processedCompetencies = Array.isArray(competenciesData) ? competenciesData : [];
      setCompetencies(processedCompetencies);

      return { roles: processedRoles, competencies: processedCompetencies };
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch required data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Group competencies by category
  const groupedCompetencies = React.useMemo(() => {
    return (competencies || []).reduce((acc, competency) => {
      const category = competency.categoryName || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(competency);
      return acc;
    }, {});
  }, [competencies]);

  // Render competency options grouped by category
  const renderCompetencyOptions = () => {
    return Object.entries(groupedCompetencies).map(([category, comps]) => (
      <optgroup label={category} key={category}>
        {comps.map(comp => (
          <option key={comp.competencyId} value={comp.competencyId}>
            {comp.competencyName} ({comp.minLevel}-{comp.maxLevel})
          </option>
        ))}
      </optgroup>
    ));
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.roleId || !formData.competencyId) {
      setError('Please select both role and competency');
      return false;
    }

    const competency = competencies.find(c => c.competencyId == formData.competencyId);
    if (!competency) return false;

    // Ensure minLevel is within competency's range
    if (formData.minLevel < 1 || formData.minLevel > 5) {
      setError(`Minimum level must be between 1 and 5`);
      return false;
    }

    // Ensure maxLevel is within competency's range
    if (formData.maxLevel < 1 || formData.maxLevel > 5) {
      setError(`Maximum level must be between 1 and 5`);
      return false;
    }

    // Ensure min is not greater than max
    if (formData.minLevel > formData.maxLevel) {
      setError('Minimum level cannot be greater than maximum level');
      return false;
    }

    return true;
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
  };

  const handleAddClick = async () => {
    try {
      setIsLoading(true);
      await fetchRolesAndCompetencies();
      setEditingMapping(null);
      setError(null);
      setFormData({
        roleId: '',
        competencyId: '',
        minLevel: 1,
        maxLevel: 5,
        isActive: true
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error preparing modal:', err);
      setError('Failed to load required data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = async (mapping) => {
    try {
      setIsLoading(true);
      await fetchRolesAndCompetencies();
      setEditingMapping(mapping);
      setError(null);

      // Find the role in the roles array that matches the mapping's roleId or empRoleId
      const role = roles.find(r =>
        r.roleId === mapping.roleId ||
        r.empRoleId === mapping.roleId ||
        r.roleId === mapping.empRoleId
      );

      setFormData({
        roleId: role?.roleId || mapping.roleId || mapping.empRoleId,
        competencyId: mapping.competencyId,
        minLevel: mapping.minLevel || 1,
        maxLevel: mapping.maxLevel || 5,
        isActive: mapping.isActive
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error preparing edit modal:', err);
      setError('Failed to load required data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      try {
        setIsLoading(true);
        await RoleCompetencyService.deleteRoleCompetencyMapping(id);
        fetchMappings();
      } catch (err) {
        // setError('Failed to delete mapping');
        console.error('Error deleting mapping:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Prepare the payload according to the API contract
      const payload = {
        id: editingMapping ? editingMapping.id : 0,
        empRoleId: parseInt(formData.roleId),
        competencyId: parseInt(formData.competencyId),
        institutionId: institutionId,
        maxLevel: formData.maxLevel ? parseInt(formData.maxLevel) : 1, // Default to 1 if not provided
        isActive: formData.isActive !== undefined ? formData.isActive : true, // Default to true if not provided
        isDeleted: false
      };
      const savedMapping = await RoleCompetencyService.saveRoleCompetencyMapping(payload);

      // Update the UI with the saved mapping
      fetchMappings();
      showNotification(
        editingMapping ? 'Mapping updated successfully' : 'Mapping added successfully'
      );

      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error saving mapping:', {
        error: err,
        response: err.response?.data
      });
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Failed to save mapping. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Convert string numbers to actual numbers for level fields
    const processedValue = type === 'number' && value !== ''
      ? parseInt(value, 10)
      : type === 'checkbox'
        ? checked
        : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear any previous errors when user makes changes
    if (error) setError(null);
  };

  // Update maxLevel when minLevel changes if needed
  useEffect(() => {
    if (formData.minLevel > formData.maxLevel) {
      setFormData(prev => ({
        ...prev,
        maxLevel: formData.minLevel
      }));
    }
  }, [formData.minLevel]);


  // Get selected competency for level validation
  const selectedCompetency = React.useMemo(() => {
    return competencies.find(c => c.competencyId == formData.competencyId);
  }, [formData.competencyId, competencies]);

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

  if (error && !isModalOpen) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-500">⚠️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="text-red-500 hover:text-red-600"
              onClick={() => setError(null)}
            >
              <span className="sr-only">Dismiss</span>
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Role Competency Mapping</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage the relationship between roles and required competencies
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Mapping
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mappings.length > 0 ? (
                mappings.map((mapping, index) => (
                  <tr key={`${mapping.id}-${mapping.competencyId}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mapping.empRoleName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mapping.competencyName}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mapping.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {mapping.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(mapping)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(mapping.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
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
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {editingMapping ? 'Edit Role Competency Mapping' : 'Add New Role Competency Mapping'}
                      </h3>

                      {error && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <span className="text-red-500">⚠️</span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-700">{error}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Role <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="roleId"
                              value={formData.roleId || ''}
                              onChange={handleInputChange}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                              required
                              disabled={!!editingMapping}
                            >
                              <option value="">Select Role</option>
                              {Array.isArray(roles) && roles.map((role) => {
                                const roleId = role.roleId || role.empRoleId;
                                const roleName = role.empRoleName || role.roleName;
                                return (
                                  <option key={roleId} value={roleId}>
                                    {roleName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Competency <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="competencyId"
                              value={formData.competencyId}
                              onChange={handleInputChange}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              required
                            >
                              <option value="">Select Competency</option>
                              {renderCompetencyOptions()}
                            </select>
                          </div>
                        </div>


                        <div className="flex items-center">
                          <input
                            id="isActive"
                            name="isActive"
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                            Active
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {editingMapping ? 'Updating...' : 'Saving...'}
                      </>
                    ) : editingMapping ? (
                      'Update Mapping'
                    ) : (
                      'Create Mapping'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRoleCompetencyMapping;
