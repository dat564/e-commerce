import { selector } from 'recoil';
import { 
  userState, 
  isAuthenticatedState, 
  accessTokenState, 
  refreshTokenState 
} from '../atoms/userAtoms';

// Check if user is admin
export const isAdminSelector = selector({
  key: 'isAdminSelector',
  get: ({ get }) => {
    const user = get(userState);
    return user && user.role === 'admin';
  },
});

// Get user's full name
export const userFullNameSelector = selector({
  key: 'userFullNameSelector',
  get: ({ get }) => {
    const user = get(userState);
    if (!user) return '';
    return user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
  },
});

// Get user's email
export const userEmailSelector = selector({
  key: 'userEmailSelector',
  get: ({ get }) => {
    const user = get(userState);
    return user?.email || '';
  },
});

// Get user's role
export const userRoleSelector = selector({
  key: 'userRoleSelector',
  get: ({ get }) => {
    const user = get(userState);
    return user?.role || 'user';
  },
});

// Check if user has specific permission
export const hasPermissionSelector = selector({
  key: 'hasPermissionSelector',
  get: ({ get }) => {
    return (permission) => {
      const user = get(userState);
      const isAdmin = get(isAdminSelector);
      
      if (isAdmin) return true;
      if (!user || !user.permissions) return false;
      
      return user.permissions.includes(permission);
    };
  },
});

// Get authentication headers for API calls
export const authHeadersSelector = selector({
  key: 'authHeadersSelector',
  get: ({ get }) => {
    const accessToken = get(accessTokenState);
    const isAuthenticated = get(isAuthenticatedState);
    
    if (!isAuthenticated || !accessToken) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  },
});

// Get user profile data for display
export const userProfileSelector = selector({
  key: 'userProfileSelector',
  get: ({ get }) => {
    const user = get(userState);
    const isAuthenticated = get(isAuthenticatedState);
    
    if (!isAuthenticated || !user) {
      return null;
    }
    
    return {
      id: user._id || user.id,
      email: user.email,
      fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
});
