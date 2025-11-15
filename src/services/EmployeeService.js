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
      console.log('Employee roles API response:', response);
      
      // Handle different response formats
      let roles = [];
      
      // Case 1: Direct array response
      if (Array.isArray(response.data)) {
        roles = response.data;
      }
      // Case 2: Response with data property
      else if (response.data && Array.isArray(response.data.data)) {
        roles = response.data.data;
      }
      // Case 3: Single object response
      else if (response.data && response.data.empRoleId) {
        roles = [response.data];
      }
      
      console.log('Extracted roles:', roles);
      
      // Map to our internal format
      const mappedRoles = roles.map(role => ({
        roleId: role.empRoleId || role.id || role.roleId,
        roleName: role.empRoleName || role.name || role.roleName || 'Unnamed Role',
        isActive: role.isActive !== false, // Default to true if not specified
        isDeleted: role.isDeleted || false
      }));
      
      console.log('Mapped roles:', mappedRoles);
      return mappedRoles;
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
      // Map our internal format to API expected format
      const apiData = {
        empRoleId: roleData.roleId,
        empRoleName: roleData.roleName,
        isActive: roleData.isActive !== false, // default to true if not specified
        isDeleted: roleData.isDeleted || false
      };
      
      const response = await axiosConfig().post(
        'CompetencyMatrix/InsertUpdateEmployeeRole',
        apiData
      );
      
      // Map the response back to our format
      if (response.data) {
        return {
          roleId: response.data.empRoleId,
          roleName: response.data.empRoleName,
          isActive: response.data.isActive,
          isDeleted: response.data.isDeleted
        };
      }
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
  }
};

export default EmployeeService;
