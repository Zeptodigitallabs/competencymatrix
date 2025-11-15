import axiosConfig from '../util/axios';
import { store } from '../store/index';

const CompetencyService = {
  // Insert or Update Competency
  async saveCompetency(competencyData) {
    try {           
      const response = await axiosConfig().post(
        `CompetencyMatrix/InsertUpdateCompetency`,
        competencyData
      );
      return response.data;
    } catch (error) {
      console.error('Error saving competency:', error);
      throw error;
    }
  },

  // Get all competencies
  async getCompetencies() {
    try {
      // Get user info from Redux store
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        console.error('Institution ID not found in user info');
        throw new Error('User institution information not available');
      }
      
      const response = await axiosConfig().post(
        'CompetencyMatrix/GetCompetencyList',
        { institutionId }
      );
      // Return the data array from the response
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching competencies:', error);
      throw error;
    }
  },
  
  // Delete a competency
  async deleteCompetency(competencyId) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/RemoveCompetency',
        { competencyId } 
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting competency:', error);
      throw error;
    }
  },

  // Get all competency categories
  async getCompetencyCategories() {
    try {
      // Get user info from Redux store
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        console.error('Institution ID not found in user info');
        throw new Error('User institution information not available');
      }
      
      const response = await axiosConfig().post(
        'CompetencyMatrix/GetCompetencyCategoryList',
        { institutionId }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching competency categories:', error);
      throw error;
    }
  },
};

export default CompetencyService;
