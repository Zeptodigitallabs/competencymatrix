import React, { useState, useEffect } from 'react';
import EmployeeMappingService from '../../services/EmployeeMappingService';
import SearchInput from '../../components/common/SearchInput/SearchInput';
import { toast } from 'react-toastify';

const LearnersPage = () => {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [manageTeamDialog, setManageTeamDialog] = useState({
    open: false,
    userId: null,
    userName: '',
    loading: false,
    teamMembers: [],
    selectedMembers: []
  });
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalCount: 0
  });

  // Initialize toast container
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }, []);

  // Filter learners based on search term
  const filteredLearners = learners.filter(learner => 
    `${learner.firstName} ${learner.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    learner.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    learner.contactNo?.includes(searchTerm)
  );

  const fetchLearners = async (page, rowsPerPage) => {
    try {
      setLoading(true);
      const response = await EmployeeMappingService.getLearnerList({
        pageNumber: page + 1,
        pageSize: rowsPerPage
      });
      
      setLearners(Array.isArray(response) ? response : (response.data || []));
      setPagination(prev => ({
        ...prev,
        totalCount: response.totalCount || 0
      }));
    } catch (err) {
      setError('Failed to fetch learners. Please try again later.');
      console.error('Error fetching learners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners(pagination.page, pagination.rowsPerPage);
  }, [pagination.page, pagination.rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination(prev => ({
      ...prev,
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10)
    }));
  };

  const handleOpenManageTeam = (userId, userName) => {
    setManageTeamDialog({
      ...manageTeamDialog,
      open: true,
      userId,
      userName,
      loading: true,
      selectedMembers: []
    });
    
    // Fetch team members for this user
    EmployeeMappingService.getLearnerListByUserId(userId)
      .then(response => {
        const members = Array.isArray(response) ? response : (response.data || []);
        const selected = members
          .filter(member => member.isTeamMember)
          .map(member => member.userId);
          
        setManageTeamDialog(prev => ({
          ...prev,
          teamMembers: members,
          selectedMembers: selected,
          loading: false
        }));
      })
      .catch(error => {
        console.error('Error fetching team members:', error);
        setManageTeamDialog(prev => ({
          ...prev,
          loading: false
        }));
        toast.error('Failed to load team members');
      });
  };

  const handleCloseManageTeam = () => {
    setManageTeamDialog({
      ...manageTeamDialog,
      open: false,
      userId: null,
      teamMembers: [],
      selectedMembers: []
    });
  };

  const handleTeamMemberToggle = (userId) => {
    setManageTeamDialog(prev => {
      const selectedIndex = prev.selectedMembers.indexOf(userId);
      let newSelected = [...prev.selectedMembers];

      if (selectedIndex === -1) {
        newSelected.push(userId);
      } else {
        newSelected.splice(selectedIndex, 1);
      }

      return { ...prev, selectedMembers: newSelected };
    });
  };

  const handleSaveTeam = () => {
    const { userId, selectedMembers } = manageTeamDialog;
    
    setManageTeamDialog(prev => ({ ...prev, loading: true }));
    
    EmployeeMappingService.insertUpdateTeam(selectedMembers, userId)
      .then(() => {
        toast.success('Team updated successfully');
        handleCloseManageTeam();
      })
      .catch(error => {
        console.error('Error updating team:', error);
        toast.error('Failed to update team');
        setManageTeamDialog(prev => ({ ...prev, loading: false }));
      });
  };

  if (loading && learners.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => fetchLearners(pagination.page, pagination.rowsPerPage)}
          className="px-4 py-2 bg-[#03045E] text-white rounded hover:bg-[#03045E]/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Teams</h2>
        <div className="w-full md:w-auto">
          <SearchInput
            placeholder="Search learners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
      </div>

      {filteredLearners.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No learners found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
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
                    Contact
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLearners.map((learner) => (
                  <tr key={learner.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${learner.firstName} ${learner.lastName}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{learner.emailId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{learner.contactNo}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${learner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {learner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenManageTeam(learner.userId, `${learner.firstName} ${learner.lastName}`)}
                        className="px-3 py-1 bg-[#03045E] text-white text-xs rounded hover:bg-[#03045E]/90 transition-colors"
                      >
                        Manage Team
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                disabled={pagination.page === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={(pagination.page + 1) * pagination.rowsPerPage >= pagination.totalCount}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                {/* <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{learners.length > 0 ? pagination.page * pagination.rowsPerPage + 1 : 0}</span> to{' '}
                  <span className="font-medium">
                    {Math.min((pagination.page + 1) * pagination.rowsPerPage, pagination.totalCount)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalCount}</span> results
                </p> */}
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <select
                    value={pagination.rowsPerPage}
                    onChange={(e) => handleChangeRowsPerPage(e)}
                    className="mr-4 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    {[5, 10, 25].map((size) => (
                      <option key={size} value={size}>
                        Show {size}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                    disabled={pagination.page === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center px 4 border-t border-b border-gray-300 bg-white text-sm font-medium">
                    Page {pagination.page + 1}
                  </div>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={(pagination.page + 1) * pagination.rowsPerPage >= pagination.totalCount}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
      )}

      {/* Manage Team Modal */}
      {manageTeamDialog.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseManageTeam}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Manage Team for {manageTeamDialog.userName}
                    </h3>
          {manageTeamDialog.loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {manageTeamDialog.teamMembers.map((member) => (
                        <tr key={member.userId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={manageTeamDialog.selectedMembers.includes(member.userId)}
                              onChange={() => handleTeamMemberToggle(member.userId)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {`${member.firstName} ${member.lastName}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.emailId}</div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveTeam}
                  disabled={manageTeamDialog.loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#03045E] text-base font-medium text-white hover:bg-[#03045E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {manageTeamDialog.loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseManageTeam}
                  disabled={manageTeamDialog.loading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
      
      {/* Toast container */}
      <div id="toast-container"></div>
    </div>
  );
}

export default LearnersPage;
