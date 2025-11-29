import axiosConfig from '../util/axios';
import { store } from '../store';

const EmployeeMappingService = {
    getLearnerList: async (params = {}) => {
        try {
            const state = store.getState();
            const institutionId = state.user?.userInfo?.institutionId;

            if (!institutionId) {
                throw new Error('User institution information not available');
            }

            const response = await axiosConfig().post('/User/GetUserList', {
                institutionId,
                centerId: params.centerId || 0,
                batchId: params.batchId || '',
                pageNumber: params.pageNumber || 1,
                pageSize: params.pageSize || 20
            });

            return response.data || { data: [], totalCount: 0 };
        } catch (error) {
            console.error('Error fetching learner list:', error);
            throw error;
        }
    },

    getLearnerListByUserId: async (userId, params = {}) => {
        try {
            const state = store.getState();
            const institutionId = state.user?.userInfo?.institutionId;

            if (!institutionId) {
                throw new Error('User institution information not available');
            }

            const response = await axiosConfig().post('/CompetencyMatrix/GetLearnersList', {
                institutionId,
                UserId: userId,
                centerId: params.centerId || 0,
                batchId: params.batchId || '',
                pageNumber: params.pageNumber || 1,
                pageSize: params.pageSize || 20
            });

            return response.data || { data: [], totalCount: 0 };
        } catch (error) {
            console.error('Error fetching learner list by user ID:', error);
            throw error;
        }
    },

    insertUpdateTeam: async (userIds, managerUserId) => {
        try {
            if (!Array.isArray(userIds) || userIds.length === 0) {
                throw new Error('User IDs must be a non-empty array');
            }

            if (!managerUserId) {
                throw new Error('Manager user ID is required');
            }

            const response = await axiosConfig().post('/CompetencyMatrix/BulkInsertUpdateEmployeeMapping', {
                UserId: userIds,
                MGRUserId: managerUserId
            });

            return response.data || { success: false, message: 'No data returned from server' };
        } catch (error) {
            console.error('Error updating team mapping:', error);
            throw error;
        }
    },

    getTeamMembers: async (userId, params = {}) => {
        try {
            const state = store.getState();
            const institutionId = state.user?.userInfo?.institutionId;

            if (!institutionId) {
                throw new Error('User institution information not available');
            }

            const response = await axiosConfig().post('/CompetencyMatrix/GetTeamMembers', {
                institutionId,
                UserId: userId,
                centerId: params.centerId || 0,
                batchId: params.batchId || '',
                pageNumber: params.pageNumber || 1,
                pageSize: params.pageSize || 20
            });

            return response.data || { data: [], totalCount: 0 };
        } catch (error) {
            console.error('Error fetching team members:', error);
            throw error;
        }
    }

};

export default EmployeeMappingService;
