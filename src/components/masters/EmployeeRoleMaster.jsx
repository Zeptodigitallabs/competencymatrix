import React, { useState, useEffect } from 'react';
import EmployeeService from '../../services/EmployeeService';
import { store } from '../../store';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-6">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

// Error message component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="p-6 text-center">
    <div className="text-red-600 mb-4">{message}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Retry
      </button>
    )}
  </div>
);

const EmployeeRoleMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    empRoleName: ''
  });

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
  try {
    setIsLoading(true);
    const data = await EmployeeService.getEmployeeRoles();
   setRoles(Array.isArray(data) ? data : (data?.data || []));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to load employee roles';
    setError(errorMessage);
    console.error('Error in fetchRoles:', {
      message: err.message,
      response: err.response,
      stack: err.stack
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleAddClick = () => {
    setEditingRole(null);
    setFormData({ empRoleName: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (role) => {
    setEditingRole(role);
    setFormData({
      empRoleName: role.empRoleName || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        setIsLoading(true);
        await EmployeeService.deleteEmployeeRole(roleId);
        setRoles(prev => prev.filter(role => role.empRoleId !== roleId));
      } catch (err) {
        setError('Failed to delete role');
        console.error('Error deleting role:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        throw new Error('Institution ID not found in user info');
      }

      const roleData = {
        empRoleId: editingRole?.empRoleId || 0,
        empRoleName: formData.empRoleName,
        institutionId: institutionId,
        isActive: true,
        isDeleted: false
      };
      console.log(roleData);
      
      await EmployeeService.saveEmployeeRole(roleData);
      
      // Refresh the roles list
      fetchRoles();
      setIsModalOpen(false);
    } catch (err) {
      setError(`Failed to ${editingRole ? 'update' : 'create'} role`);
      console.error('Error saving role:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter roles based on search term
  const filteredRoles = roles.filter(role => 
    (role.empRoleName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Handle error state
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchRoles} />;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Employee Roles</h2>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search roles..."
            className="border rounded px-3 py-2 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span> Add Role
          </button>
        </div>
      </div>

      {roles.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No roles found.</p>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Create Your First Role
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map((role) => (
                  <tr key={role.empRoleId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {role.empRoleId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {role.empRoleName || 'Unnamed Role'}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{role.description || 'No description'}</div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        role.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="w-40 px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(role)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(role.empRoleId)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingRole ? 'Edit Role' : 'Add New Role'}
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="empRoleName" className="block text-sm font-medium text-gray-700">
                          Role Name *
                        </label>
                        <input
                          type="text"
                          name="empRoleName"
                          id="empRoleName"
                          required
                          value={formData.empRoleName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                        >
                          {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRoleMaster;
