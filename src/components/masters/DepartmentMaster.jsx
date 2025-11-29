import React, { useState, useEffect } from 'react';
import DepartmentMasterService from '../../services/DepartmentMasterService';
import { store } from '../../store';
import SearchInput from '../common/SearchInput/SearchInput';

const DepartmentMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [department, setDepartment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    deptName: ''
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchDepartmentList();
  }, []);

  const fetchDepartmentList = async () => {
    try {
      setIsLoading(true);
      const data = await DepartmentMasterService.getDepartmentList();
      setDepartment(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      setError('Failed to load Department');
      console.error('Error fetching Department:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingDepartment(null);
    setFormData({ deptName: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setFormData({
      deptName: department.deptName || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (deptId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        setIsLoading(true);
        await DepartmentMasterService.DeleteDepartment(deptId);
        setDepartment(prev => prev.filter(cat => cat.deptId !== deptId));
      } catch (err) {
        setError('Failed to delete department');
        console.error('Error deleting department:', err);
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
      const departmentData = {
        deptId: editingDepartment?.deptId || 0,
        deptName: formData.deptName,
        institutionId: institutionId,
        isActive: true,
        isDeleted: false
      };

      const savedDepartment = await DepartmentMasterService.InsertUpdateDepartment(departmentData);

      fetchDepartmentList();
      setIsModalOpen(false);
    } catch (err) {
      setError(`Failed to ${editingDepartment ? 'update' : 'create'} department`);
      console.error('Error saving department:', err);
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

  // Filter categories based on search term
  const filteredDepartment = department.filter(department =>
    department.deptName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && department.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Department Master</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-[#03045E] text-white rounded hover:bg-[#03045E]/90 transition-colors flex items-center"
        >
          + Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <SearchInput
            placeholder="Search department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md"
          />
        </div>
      </div>

      {/* Department Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartment.length > 0 ? (
                filteredDepartment.map((department) => (
                  <tr key={department.deptId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{department.deptName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(department)}
                        className="text-[#03045E] hover:opacity-80 mr-4"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(department.deptId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No Department found. Try adjusting your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="deptName" className="block text-sm font-medium text-gray-700">
                          Department Name *
                        </label>
                        <input
                          type="text"
                          name="deptName"
                          id="deptName"
                          required
                          value={formData.deptName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#03045E] focus:border-[#03045E] sm:text-sm"
                        />
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#03045E] text-base font-medium text-white hover:bg-[#03045E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03045E] sm:col-start-2 sm:text-sm disabled:opacity-50"
                        >
                          {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-[#03045E] shadow-sm px-4 py-2 bg-white text-base font-medium text-[#03045E] hover:bg-[#03045E]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03045E] sm:mt-0 sm:col-start-1 sm:text-sm"
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

export default DepartmentMaster;
