import axiosConfig from '../util/axios';
import { store } from '../store/index';

const RoleCompetencyService = {
  // Get all role-competency mappings
  async getRoleCompetencyMappings() {
    try {
      // Get user info from Redux store
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        console.error('Institution ID not found in user info');
        throw new Error('User institution information not available');
      }
      
      const response = await axiosConfig().post(
        'CompetencyMatrix/GetEmployeeRoleCompetencyList',
        { institutionId }
      );
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching role-competency mappings:', error);
      throw error;
    }
  },
  
  // Save role-competency mapping (create or update)
  async saveRoleCompetencyMapping(mappingData) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/InsertUpdateEmployeeRoleCompetency',
        mappingData
      );
      return response.data;
    } catch (error) {
      console.error('Error saving role-competency mapping:', error);
      throw error;
    }
  },
  
  // Delete role-competency mapping
  async deleteRoleCompetencyMapping(id) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/RemoveEmployeeRoleCompetency',
        { id}
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting role-competency mapping:', error);
      throw error;
    }
  }
};

export default RoleCompetencyService;
