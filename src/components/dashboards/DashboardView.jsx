import React, { useState, useEffect } from 'react';
import KPI from './KPI';
import TeamCompetencyMatrix from './TeamCompetencyMatrix';
import TeamAssessments from './TeamAssessments';
import TeamLearningPaths from './TeamLearningPaths';
import DashboardService from '../../services/DashboardService';
import { toast } from 'react-toastify';

const DashboardView = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await DashboardService.getAdminDashboardSummary();
        if (response.isSuccess && Array.isArray(response.data)) {
          setDashboardData(response.data);
        } else {
          throw new Error('Invalid dashboard data format');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get subtitle based on label
  const getSubtitle = (label) => {
    const subtitles = {
      'Total Employee': 'Across all departments',
      'Achieved Competency': 'Successfully completed',
      'In Progress': 'Currently working on',
      'Not Started': 'Yet to begin'
    };
    return subtitles[label] || '';
  };

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-500">
          {error}
        </div>
      ) : dashboardData && dashboardData.length > 0 ? (
        <div className={`grid grid-cols-1 ${dashboardData.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''} gap-4`}>
          {dashboardData.map((item, index) => (
            <KPI 
              key={index}
              title={item.label} 
              value={item.value} 
              sub={getSubtitle(item.label)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          No dashboard data available
        </div>
      )}
    </div>
  );
};

export default DashboardView;
