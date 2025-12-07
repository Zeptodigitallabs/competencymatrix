import axiosConfig from '../util/axios';
import { store } from '../store/index';

const EmployeeService = {
  // Get all employee roles
  async getEmployeeRoles() {
    try {
      console.log('Fetching employee roles...');
      // Get user info from Redux store
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        console.error('Institution ID not found in user info');
        throw new Error('User institution information not available');
      }
      
      const response = await axiosConfig().post(
        'CompetencyMatrix/GetEmployeeRoleList',
        { institutionId }
      );
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('Error fetching employee roles:', {
        message: error.message,
        response: error.response,
        config: error.config,
        stack: error.stack
      });
      throw error;
    }
  },
  
  // Save employee role (create or update)
  async saveEmployeeRole(roleData) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/InsertUpdateEmployeeRole',
        roleData
      );
      return response.data;
    } catch (error) {
      console.error('Error saving employee role:', error);
      throw error;
    }
  },
  
  // Delete employee role
  async deleteEmployeeRole(roleId) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/RemoveEmployeeRole',
        { empRoleId: roleId } // Using empRoleId as expected by the API
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting employee role:', error);
      throw error;
    }
  },

  // Get logged-in employee's competency profile
  async getMyCompetencyProfile() {
    try {
      const response = await axiosConfig().get('CompetencyMatrix/MyCompetencyProfile');
      return response.data;
    } catch (error) {
      console.error('Error fetching my competency profile:', error);
      throw error;
    }
  },

  // Get team report for the logged-in manager
  async getTeamReport() {
    try {
      const response = await axiosConfig().get('CompetencyMatrix/GetTeamReport');
      return response.data;
    } catch (error) {
      console.error('Error fetching team report:', error);
      throw error;
    }
  },

  async checkIfManager() {
    try {
      const response = await this.getTeamReport();
      return {
        isManager: response.isSuccess && response.data && response.data.length > 0,
        teamData: response.data || []
      };
    } catch (error) {
      console.error('Error checking manager status:', error);
      return { isManager: false, teamData: [] };
    }
  },
  
  // View evidence for a specific user
  async viewEvidence(userId) {
    try {
      const response = await axiosConfig().get(`CompetencyMatrix/ViewEvidence?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user evidence:', error);
      throw error;
    }
  }
};

export default EmployeeService;
