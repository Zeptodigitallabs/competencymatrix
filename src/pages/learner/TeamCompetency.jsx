// src/pages/learner/TeamCompetency.jsx
import React, { useState, useEffect } from 'react';
import EmployeeService from '../../services/EmployeeService';

const TeamCompetency = () => {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [evidenceData, setEvidenceData] = useState(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  useEffect(() => {
    const fetchTeamReport = async () => {
      try {
        setLoading(true);
        const response = await EmployeeService.getTeamReport();
        if (response.isSuccess) {
          setTeamData(response.data || []);
        } else {
          throw new Error('Failed to load team report');
        }
      } catch (err) {
        console.error('Error fetching team report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamReport();
  }, []);

  const handleViewEvidence = async (userId) => {
    try {
      setLoading(true);
      const response = await EmployeeService.viewEvidence(userId);
      if (response.isSuccess) {
        setEvidenceData(response.data);
        const user = teamData.find(user => user.userId === userId);
        setSelectedUser(user ? user.employeeName : 'User');
        setShowEvidenceModal(true);
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
      setError('Failed to load evidence data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showEvidenceModal) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Team Competency Report</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamData.map((member, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{member.employeeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{member.totalCompetenciesAssigned}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{member.achieved}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{member.inProgress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{member.averageGap.toFixed(1)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewEvidence(member.userId)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Evidence
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Evidence for {selectedUser}
              </h3>
            </div>
            <div className="p-6">
              {evidenceData && evidenceData.length > 0 ? (
                <div className="space-y-4">
                  {evidenceData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{item.competencyName}</h4>
                          <p className="text-sm text-gray-500">{item.categoryName}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">
                            Level: {item.achievedLevel}/{item.maxLevel}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="font-medium">Course:</span> {item.courseName} ({item.courseCode})
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Start Date:</span> {new Date(item.startDate).toLocaleDateString()}
                        </p>
                        {item.completionDate ? (
                          <p className="text-sm">
                            <span className="font-medium">Completion Date:</span> {new Date(item.completionDate).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-yellow-600">In Progress</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No evidence data available.</p>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCompetency;