import axiosConfig from '../util/axios';

const RoleCompetencyService = {
  // Get all role-competency mappings
  async getRoleCompetencyMappings() {
    try {
      const response = await axiosConfig().get('CompetencyMatrix/GetEmployeeRoleCompetencyList');
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
  async deleteRoleCompetencyMapping(roleId, competencyId) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/RemoveEmployeeRoleCompetency',
        { roleId, competencyId }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting role-competency mapping:', error);
      throw error;
    }
  }
};

export default RoleCompetencyService;
