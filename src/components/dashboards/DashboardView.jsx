import React, { useState, useEffect } from 'react';
import KPI from './KPI';
import CompetencyGapsTable from './CompetencyGapsTable';
import TopAchievedCompetencies from './TopAchievedCompetencies';
import CompetencySummaryTable from './CompetencySummaryTable';
import DashboardService from '../../services/DashboardService';
import { toast } from 'react-toastify';

const DashboardView = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [competencyGaps, setCompetencyGaps] = useState([]);
  const [achievedCompetencies, setAchievedCompetencies] = useState([]);
  const [competencySummary, setCompetencySummary] = useState([]);
  const [loading, setLoading] = useState({
    dashboard: true,
    gaps: true,
    achieved: true,
    summary: true
  });
  const [error, setError] = useState({
    dashboard: null,
    gaps: null,
    achieved: null,
    summary: null
  });

  // Fetch dashboard summary data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await DashboardService.getAdminDashboardSummary();
        if (response.isSuccess && Array.isArray(response.data)) {
          setDashboardData(response.data);
        } else {
          throw new Error('Invalid dashboard data format');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(prev => ({ ...prev, dashboard: err.message }));
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(prev => ({ ...prev, dashboard: false }));
      }
    };

    // Fetch competency gaps data
    const fetchCompetencyGaps = async () => {
      try {
        const response = await DashboardService.getTopCompetencyGaps();
        if (response.isSuccess && Array.isArray(response.data)) {
          setCompetencyGaps(response.data);
        } else {
          throw new Error('Invalid competency gaps data format');
        }
      } catch (err) {
        console.error('Error fetching competency gaps:', err);
        setError(prev => ({ ...prev, gaps: err.message }));
        toast.error('Failed to load competency gaps data');
      } finally {
        setLoading(prev => ({ ...prev, gaps: false }));
      }
    };

    const fetchAchievedCompetencies = async () => {
      try {
        const response = await DashboardService.getTopAchievedCompetencies();
        if (response.isSuccess && Array.isArray(response.data)) {
          setAchievedCompetencies(response.data);
        } else {
          throw new Error('Invalid achieved competencies data format');
        }
      } catch (err) {
        console.error('Error fetching achieved competencies:', err);
        setError(prev => ({ ...prev, achieved: err.message }));
        toast.error('Failed to load achieved competencies data');
      } finally {
        setLoading(prev => ({ ...prev, achieved: false }));
      }
    };

    const fetchCompetencySummary = async () => {
      try {
        const response = await DashboardService.getCompetencyWiseSummary();
        if (response.isSuccess && Array.isArray(response.data)) {
          setCompetencySummary(response.data);
        } else {
          throw new Error('Invalid competency summary data format');
        }
      } catch (err) {
        console.error('Error fetching competency summary:', err);
        setError(prev => ({ ...prev, summary: err.message }));
        toast.error('Failed to load competency summary data');
      } finally {
        setLoading(prev => ({ ...prev, summary: false }));
      }
    };

    fetchDashboardData();
    fetchCompetencyGaps();
    fetchAchievedCompetencies();
    fetchCompetencySummary();
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

  // Calculate progress percentage
  const getProgressPercentage = (achieved, max) => {
    return Math.round((achieved / max) * 100);
  };

  return (
    <div className="p-6 space-y-8">
      {/* KPI Cards Section */}
      {loading.dashboard ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error.dashboard ? (
        <div className="text-center p-8 text-red-500">
          {error.dashboard}
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

      {/* Tables Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompetencyGapsTable 
            data={competencyGaps}
            loading={loading.gaps}
            error={error.gaps}
          />
          
          <TopAchievedCompetencies
            data={achievedCompetencies}
            loading={loading.achieved}
            error={error.achieved}
          />
        </div>
        
        <CompetencySummaryTable
          data={competencySummary}
          loading={loading.summary}
          error={error.summary}
        />
      </div>
    </div>
  );
};

export default DashboardView;