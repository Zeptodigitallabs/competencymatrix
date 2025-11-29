import axiosConfig from '../util/axios';
import { store } from '../store';

const DepartmentMasterService = {
  // Get all competency categories
  async getDepartmentList() {
    try {
      const state = store.getState();
      const institutionId = state.user?.userInfo?.institutionId;
      
      if (!institutionId) {
        console.error('Institution ID not found in user info');
        throw new Error('User institution information not available');
      }
      
      const response = await axiosConfig().post(
        'CompetencyMatrix/GetDepartmentList',
        { institutionId }
      );
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('Error fetching Department List:', error);
      throw error;
    }
  },

  // Save or update a competency category
  async InsertUpdateDepartment(departmentdata) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/InsertUpdateDepartment',
        departmentdata
      );
      return response.data;
    } catch (error) {
      console.error('Error saving Department:', error);
      throw error;
    }
  },
  
  // Delete a competency category
  async DeleteDepartment(deptId) {
    try {
      const response = await axiosConfig().post(
        'CompetencyMatrix/RemoveDepartment',
        {id: deptId }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting Department:', error);
      throw error;
    }
  }
};

export default  DepartmentMasterService;
