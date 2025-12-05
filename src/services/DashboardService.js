import axiosConfig from '../util/axios';
import { store } from '../store';

const DashboardService = {
  /**
   * Fetches the admin dashboard summary data
   * @returns {Promise<Object>} The dashboard summary data
   */
  async getAdminDashboardSummary() {
    try {
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        console.error('Institution ID not found in user info');
        throw new Error('User institution information not available');
      }
      
      const response = await axiosConfig().get(
        `CompetencyMatrix/GetAdminDashboardSummary?institutionId=${institutionId}`
      );
      
      return response.data || {};
    } catch (error) {
      console.error('Error fetching admin dashboard summary:', error);
      throw error;
    }
  },

  /**
   * Fetches the top competency gaps for the institution
   * @returns {Promise<Array>} Array of top competency gaps
   */
  async getTopCompetencyGaps() {
    try {
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        console.error('Institution ID not found in user info');
        throw new Error('User institution information not available');
      }
      
      const response = await axiosConfig().get(
        `CompetencyMatrix/GetTopCompetencyGaps?institutionId=${institutionId}`
      );
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching top competency gaps:', error);
      throw error;
    }
  },

  /**
   * Fetches the top achieved competencies for the institution
   * @returns {Promise<Array>} Array of top achieved competencies
   */
  async getTopAchievedCompetencies() {
    try {
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        console.error('Institution ID not found in user info');
        throw new Error('User institution information not available');
      }
      
      const response = await axiosConfig().get(
        `CompetencyMatrix/GetTopAchievedCompetencies?institutionId=${institutionId}`
      );
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching top achieved competencies:', error);
      throw error;
    }
  },

  /**
   * Fetches the competency-wise summary for the institution
   * @returns {Promise<Array>} Array of competency summary data
   */
  async getCompetencyWiseSummary() {
    try {
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        console.error('Institution ID not found in user info');
        throw new Error('User institution information not available');
      }
      
      const response = await axiosConfig().get(
        `CompetencyMatrix/GetCompetencyWiseSummary?institutionId=${institutionId}`
      );
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching competency-wise summary:', error);
      throw error;
    }
  }
};

export default DashboardService;