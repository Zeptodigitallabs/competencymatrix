import axiosConfig from '../util/axios';

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
      const response = await axiosConfig().get(
        'CompetencyMatrix/GetCompetencyList'
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
      const response = await axiosConfig().get(
        'CompetencyMatrix/GetCompetencyCategoryList'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching competency categories:', error);
      throw error;
    }
  },
};

export default CompetencyService;
