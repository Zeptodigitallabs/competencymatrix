import axiosConfig from '../util/axios';
import { store } from '../store';

const CompetencyCategoriesService = {
  // Get all competency categories
  async getCompetencyCategories() {
    try {
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
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('Error fetching competency categories:', error);
      throw error;
    }
  },

  // Save or update a competency category
  async saveCompetencyCategory(categoryData) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/InsertUpdateCompetencyCategory',
        categoryData
      );
      return response.data;
    } catch (error) {
      console.error('Error saving competency category:', error);
      throw error;
    }
  },
  
  // Delete a competency category
  async deleteCompetencyCategory(categoryId) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/RemoveCompetencyCategory',
        {compCategoryId: categoryId }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting competency category:', error);
      throw error;
    }
  }
};

export default CompetencyCategoriesService;
