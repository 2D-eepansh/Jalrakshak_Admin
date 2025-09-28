import { useAuth } from './useAuth'

export type UserRole = 'admin' | 'moderator' | 'viewer'

export interface Permission {
  canViewDashboard: boolean
  canManageReports: boolean
  canSendAlerts: boolean
  canViewLogs: boolean
  canRunPredictions: boolean
  canExportData: boolean
  canManageUsers: boolean
}

const rolePermissions: Record<UserRole, Permission> = {
  admin: {
    canViewDashboard: true,
    canManageReports: true,
    canSendAlerts: true,
    canViewLogs: true,
    canRunPredictions: true,
    canExportData: true,
    canManageUsers: true,
  },
  moderator: {
    canViewDashboard: true,
    canManageReports: true,
    canSendAlerts: true,
    canViewLogs: false,
    canRunPredictions: true,
    canExportData: true,
    canManageUsers: false,
  },
  viewer: {
    canViewDashboard: true,
    canManageReports: false,
    canSendAlerts: false,
    canViewLogs: false,
    canRunPredictions: false,
    canExportData: false,
    canManageUsers: false,
  },
}

export const useRoleBasedAccess = () => {
  const { user } = useAuth()

  // For now, we'll determine role based on email or user metadata
  // In a real app, this would come from the user's profile or JWT token
  const getUserRole = (): UserRole => {
    if (!user?.email) return 'viewer'
    
    // Simple role assignment based on email for demo
    if (user.email.includes('admin')) return 'admin'
    if (user.email.includes('moderator')) return 'moderator'
    
    // Default to admin for demo purposes
    return 'admin'
  }

  const userRole = getUserRole()
  const permissions = rolePermissions[userRole]

  const hasPermission = (permission: keyof Permission): boolean => {
    return permissions[permission]
  }

  const canAccessTab = (tab: string): boolean => {
    switch (tab) {
      case 'dashboard':
        return hasPermission('canViewDashboard')
      case 'reports':
        return hasPermission('canManageReports')
      case 'alerts':
        return hasPermission('canSendAlerts')
      case 'logs':
        return hasPermission('canViewLogs')
      case 'prediction':
        return hasPermission('canRunPredictions')
      default:
        return false
    }
  }

  return {
    userRole,
    permissions,
    hasPermission,
    canAccessTab,
    isAdmin: userRole === 'admin',
    isModerator: userRole === 'moderator',
    isViewer: userRole === 'viewer',
  }
}
