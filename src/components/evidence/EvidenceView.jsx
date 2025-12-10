import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import { toast } from 'react-toastify';

const EvidenceView = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('achieved');
  const [loading, setLoading] = useState(true);
  const [evidenceData, setEvidenceData] = useState({
    achieved: [],
    inProgress: []
  });

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        setLoading(true);
        const response = await EmployeeService.viewEvidence(userId);
        // Categorize evidence
        const categorized = response.data.reduce((acc, item) => {
          const highestLevel = Math.max(...item.courseEvidence.map(c => c.achievedLevel));
          const isAchieved = highestLevel >= item.maxLevel;
          
          if (isAchieved) {
            acc.achieved.push({...item, highestLevel});
          } else {
            acc.inProgress.push({...item, highestLevel});
          }
          return acc;
        }, { achieved: [], inProgress: [] });

        setEvidenceData(categorized);
      } catch (error) {
        console.error('Error fetching evidence:', error);
        toast.error('Failed to load evidence data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEvidence();
    }
  }, [userId]);

  const renderCompetencyTable = (competencies) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border text-left">Competency Name</th>
            <th className="py-2 px-4 border text-left">Category Name</th>
            <th className="py-2 px-4 border text-center">Required Level</th>
            <th className="py-2 px-4 border text-center">Achieved Level</th>
          </tr>
        </thead>
        <tbody>
          {competencies.map((competency, idx) => (
            <React.Fragment key={`${competency.competencyName}-${idx}`}>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{competency.competencyName}</td>
                <td className="py-2 px-4 border">{competency.categoryName}</td>
                <td className="py-2 px-4 border text-center">{competency.maxLevel}</td>
                <td className="py-2 px-4 border text-center font-medium">
                  {competency.highestLevel}
                </td>
              </tr>
              <tr>
                <td colSpan="4" className="px-4 py-2 border">
                  <div className="ml-8 my-2">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Courses:</h4>
                    <table className="min-w-full bg-gray-50">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-1 px-3 border text-left text-sm">Course Name</th>
                          <th className="py-1 px-3 border text-center text-sm">Level</th>
                          <th className="py-1 px-3 border text-center text-sm">Achieved Level</th>
                          <th className="py-1 px-3 border text-center text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {competency.courseEvidence.map((course, courseIdx) => (
                          <tr 
                            key={`${course.courseCode}-${courseIdx}`}
                            className={course.achievedLevel === 0 ? 'bg-red-50' : ''}
                          >
                            <td className="py-1 px-3 border text-sm">{course.courseName}</td>
                            <td className="py-1 px-3 border text-center text-sm">
                            {competency.maxLevel}
                            </td>
                            <td className="py-1 px-3 border text-center text-sm">
                             {course.achievedLevel}
                            </td>
                            <td className="py-1 px-3 border text-center text-sm">
                              {course.achievedLevel > 0 ? 'Completed' : 'Not Started'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading evidence data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Evidence View</h2>
      
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'achieved' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('achieved')}
        >
          Competency Achieved ({evidenceData.achieved.length})
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'inProgress' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('inProgress')}
        >
          Competency Gap ({evidenceData.inProgress.length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activeTab === 'achieved' ? (
          evidenceData.achieved.length > 0 ? (
            renderCompetencyTable(evidenceData.achieved)
          ) : (
            <p className="text-gray-500 p-4">No achieved competencies found.</p>
          )
        ) : evidenceData.inProgress.length > 0 ? (
          renderCompetencyTable(evidenceData.inProgress)
        ) : (
          <p className="text-gray-500 p-4">No competency gaps found.</p>
        )}
      </div>
    </div>
  );
};

export default EvidenceView;