import React, { useState, useEffect } from 'react';
import EmployeeMappingService from '../../services/EmployeeMappingService';
import { toast } from 'react-toastify';

const TeamMapping = () => {
  const [loading, setLoading] = useState(true);
  const [learners, setLearners] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Manager modal state
  const [managerModal, setManagerModal] = useState({
    open: false,
    userId: null,
    userName: '',
    searchTerm: '',
    searchResults: [],
    isSearching: false,
    selectedManager: null
  });

  const fetchLearners = async (search = '') => {
    try {
      setLoading(true);
      const response = await EmployeeMappingService.getLearnerList({
        searchTerm: search
      });
      
      if (response && response.isSuccess && response.data) {
        setLearners(response.data);
      } else {
        setLearners([]);
      }
    } catch (error) {
      console.error('Error fetching learners:', error);
      setError('Failed to load learners. Please try again later.');
      toast.error('Failed to load learners');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.warning('Please enter a search term');
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    fetchLearners(searchTerm);
  };

  const handleRemoveManager = async (userId) => {
    if (window.confirm('Are you sure you want to remove this manager?')) {
      try {
        await EmployeeMappingService.removeManager(userId);
        toast.success('Manager removed successfully');
        fetchLearners(searchTerm); // Refresh the list
      } catch (error) {
        console.error('Error removing manager:', error);
        toast.error('Failed to remove manager');
      }
    }
  };

  const handleOpenManagerModal = (userId, userName) => {
    setManagerModal({
      ...managerModal,
      open: true,
      userId,
      userName,
      searchTerm: '',
      searchResults: [],
      selectedManager: null
    });
  };

  const handleCloseManagerModal = () => {
    setManagerModal({
      ...managerModal,
      open: false,
      userId: null,
      userName: '',
      searchTerm: '',
      searchResults: [],
      selectedManager: null
    });
  };

  const handleManagerSearch = async (e) => {
    e.preventDefault();
    if (!managerModal.searchTerm.trim()) {
      toast.warning('Please enter a search term');
      return;
    }

    try {
      setManagerModal(prev => ({ ...prev, isSearching: true }));
      const response = await EmployeeMappingService.getLearnerList({
        searchTerm: managerModal.searchTerm
      });
      
      setManagerModal(prev => ({
        ...prev,
        searchResults: Array.isArray(response) ? response : (response.data || []),
        isSearching: false
      }));
    } catch (error) {
      console.error('Error searching for managers:', error);
      toast.error('Failed to search for managers');
      setManagerModal(prev => ({ ...prev, isSearching: false }));
    }
  };

  const handleSelectManager = (manager) => {
    setManagerModal(prev => ({
      ...prev,
      selectedManager: manager
    }));
  };

  const handleAssignManager = async () => {
    if (!managerModal.selectedManager) {
      toast.warning('Please select a manager');
      return;
    }

    try {
      await EmployeeMappingService.addManager(
        managerModal.userId,
        managerModal.selectedManager.userId
      );
      
      toast.success('Manager assigned successfully');
      fetchLearners(searchTerm); // Refresh the list
      handleCloseManagerModal();
    } catch (error) {
      console.error('Error assigning manager:', error);
      toast.error('Failed to assign manager');
    }
  };

  // Remove the initial fetch effect

  if (isSearching) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Manager Assignment Modal */}
      {managerModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Assign Manager to {managerModal.userName}</h3>
            </div>
            
            <div className="p-6 border-b">
              <form onSubmit={handleManagerSearch} className="flex gap-2">
                <input
                  type="text"
                  value={managerModal.searchTerm}
                  onChange={(e) => setManagerModal(prev => ({ ...prev, searchTerm: e.target.value }))}
                  placeholder="Search for a manager..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={managerModal.isSearching}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {managerModal.isSearching ? 'Searching...' : 'Search'}
                </button>
              </form>
              
              <div className="mt-4 overflow-y-auto max-h-96">
                {managerModal.searchResults.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {managerModal.searchResults.map((user) => (
                        <tr 
                          key={user.userId} 
                          className={`hover:bg-gray-50 ${
                            managerModal.selectedManager?.userId === user.userId ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.emailId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.deptName || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleSelectManager(user)}
                              className={`px-3 py-1 rounded-md ${
                                managerModal.selectedManager?.userId === user.userId
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                              }`}
                            >
                              {managerModal.selectedManager?.userId === user.userId ? 'Selected' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : managerModal.isSearching ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : managerModal.searchTerm ? (
                  <div className="text-center p-4 text-gray-500">
                    No managers found. Try a different search term.
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    Search for managers to assign
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={handleCloseManagerModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignManager}
                disabled={!managerModal.selectedManager}
                className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  managerModal.selectedManager
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Assign Manager
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Team Mapping</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or department..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {!hasSearched ? (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6 text-center">
          <p className="text-gray-500">Enter a search term to find users and manage their teams.</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => fetchLearners(searchTerm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {learners.length > 0 ? (
                  learners.map((learner) => (
                    <tr key={learner.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {learner.firstName} {learner.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{learner.emailId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{learner.deptName || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {learner.managerName || 'No manager assigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {learner.hasManager ? (
                          <button
                            onClick={() => handleRemoveManager(learner.userId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove Manager
                          </button>
                        ) : (
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleOpenManagerModal(learner.userId, `${learner.firstName} ${learner.lastName}`)}
                          >
                            Add Manager
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No learners found. Try a different search term.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMapping;
