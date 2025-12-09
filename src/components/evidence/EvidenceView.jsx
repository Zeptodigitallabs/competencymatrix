import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import { toast } from 'react-toastify';

const EvidenceView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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
          const isAchieved = item.courseEvidence.some(
            course => course.achievedLevel >= item.maxLevel
          );
          
          if (isAchieved) {
            acc.achieved.push(item);
          } else {
            acc.inProgress.push(item);
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

  const renderCompetencyCard = (competency) => (
    <div key={`${competency.competencyName}-${competency.categoryName}`} 
         className="bg-white p-4 rounded-lg shadow mb-4">
      <h4 className="font-medium text-lg">{competency.competencyName}</h4>
      <p className="text-gray-600 text-sm">Category: {competency.categoryName}</p>
      <p className="text-gray-600 text-sm">Max Level: {competency.maxLevel}</p>
      
      <div className="mt-2">
        <h5 className="font-medium">Course Evidence:</h5>
        {competency.courseEvidence.map((course, idx) => (
          <div key={idx} className="ml-4 mt-1 p-2 bg-gray-50 rounded">
            <p className="font-medium">{course.courseName} ({course.courseCode})</p>
            <p className="text-sm">Achieved Level: {course.achievedLevel}</p>
            <p className="text-sm">Start Date: {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}</p>
            <p className="text-sm">Completion Date: {course.completionDate ? new Date(course.completionDate).toLocaleDateString() : 'In Progress'}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold">Competency Evidence</h2>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('achieved')}
            className={`${activeTab === 'achieved' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Achieved Competencies ({evidenceData.achieved.length})
          </button>
          <button
            onClick={() => setActiveTab('inProgress')}
            className={`${activeTab === 'inProgress' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            In Progress ({evidenceData.inProgress.length})
          </button>
        </nav>
      </div>

      <div className="space-y-4">
        {activeTab === 'achieved' ? (
          evidenceData.achieved.length > 0 ? (
            evidenceData.achieved.map(renderCompetencyCard)
          ) : (
            <p className="text-gray-500">No achieved competencies found.</p>
          )
        ) : evidenceData.inProgress.length > 0 ? (
          evidenceData.inProgress.map(renderCompetencyCard)
        ) : (
          <p className="text-gray-500">No in-progress competencies found.</p>
        )}
      </div>
    </div>
  );
};

export default EvidenceView;
