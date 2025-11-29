/**
 * Role-based access control (RBAC) utility
 * Manages user permissions and role-based access control
 */

// Define all available roles in the application
export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'User',
  GUEST: 'Guest'
};

// Define permissions for each role
const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    'view_dashboard',
    'manage_users',
    'manage_roles',
    'manage_permissions',
    'view_reports',
    'manage_settings',
    'export_data',
    'import_data',
    'delete_records',
    'manage_competency_matrix',
    'approve_competencies',
    'assign_roles',
    'audit_logs'
  ],
  [ROLES.ADMIN]: [
    'view_dashboard',
    'manage_users',
    'view_reports',
    'manage_settings',
    'export_data',
    'import_data',
    'manage_competency_matrix',
    'approve_competencies',
    'audit_logs'
  ],
  [ROLES.MANAGER]: [
    'view_dashboard',
    'view_reports',
    'export_data',
    'manage_team_competencies',
    'approve_team_competencies'
  ],
  [ROLES.USER]: [
    'view_dashboard',
    'update_own_profile',
    'view_own_competencies',
    'update_own_competencies',
    'request_competency_approval'
  ],
  [ROLES.GUEST]: [
    'view_public_content'
  ]
};

/**
 * Gets all permissions for a given role
 * @param {string} role - The user role
 * @returns {Array} - Array of permissions for the role
 */
export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Checks if a user has a specific permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} - True if the user has the permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  const permissions = getPermissionsForRole(userRole);
  return permissions.includes(permission);
};

/**
 * Checks if a user has any of the specified permissions
 * @param {string} userRole - The user's role
 * @param {Array} requiredPermissions - Array of permissions to check
 * @returns {boolean} - True if the user has at least one of the required permissions
 */
export const hasAnyPermission = (userRole, requiredPermissions) => {
  if (!userRole || !requiredPermissions || !requiredPermissions.length) return false;
  const userPermissions = getPermissionsForRole(userRole);
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

/**
 * Checks if a user has all of the specified permissions
 * @param {string} userRole - The user's role
 * @param {Array} requiredPermissions - Array of permissions to check
 * @returns {boolean} - True if the user has all of the required permissions
 */
export const hasAllPermissions = (userRole, requiredPermissions) => {
  if (!userRole || !requiredPermissions || !requiredPermissions.length) return false;
  const userPermissions = getPermissionsForRole(userRole);
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

/**
 * Higher-order component for protecting routes based on permissions
 * @param {React.Component} WrappedComponent - The component to protect
 * @param {Object} options - Options for the permission check
 * @param {Array} options.requiredPermissions - Required permissions to access the component
 * @param {boolean} options.requireAll - If true, user must have all permissions, otherwise any permission is sufficient
 * @param {React.Component} options.FallbackComponent - Component to render if permission check fails
 * @returns {React.Component} - Protected component
 */
export const withPermission = (WrappedComponent, options = {}) => {
  const {
    requiredPermissions = [],
    requireAll = true,
    FallbackComponent = () => null
  } = options;

  return (props) => {
    const { userRole } = props; // This would come from your auth context or Redux
    
    const hasAccess = requireAll 
      ? hasAllPermissions(userRole, requiredPermissions)
      : hasAnyPermission(userRole, requiredPermissions);

    if (!hasAccess) {
      return <FallbackComponent />;
    }

    return <WrappedComponent {...props} />;
  };
};

/**
 * Hook to check permissions in functional components
 * @param {string} userRole - The user's role
 * @returns {Object} - Object with permission check methods
 */
export const usePermissions = (userRole) => {
  return {
    hasPermission: (permission) => hasPermission(userRole, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(userRole, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(userRole, permissions),
    getPermissions: () => getPermissionsForRole(userRole)
  };
};

// Export all permission strings as constants
export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_PERMISSIONS: 'manage_permissions',
  VIEW_REPORTS: 'view_reports',
  MANAGE_SETTINGS: 'manage_settings',
  EXPORT_DATA: 'export_data',
  IMPORT_DATA: 'import_data',
  DELETE_RECORDS: 'delete_records',
  MANAGE_COMPETENCY_MATRIX: 'manage_competency_matrix',
  APPROVE_COMPETENCIES: 'approve_competencies',
  ASSIGN_ROLES: 'assign_roles',
  AUDIT_LOGS: 'audit_logs',
  UPDATE_OWN_PROFILE: 'update_own_profile',
  VIEW_OWN_COMPETENCIES: 'view_own_competencies',
  UPDATE_OWN_COMPETENCIES: 'update_own_competencies',
  REQUEST_COMPETENCY_APPROVAL: 'request_competency_approval',
  VIEW_PUBLIC_CONTENT: 'view_public_content'
};
