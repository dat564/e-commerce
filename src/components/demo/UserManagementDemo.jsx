"use client";

import { useAuth } from "@/store";
import { 
  userState, 
  isAuthenticatedState, 
  isAdminSelector,
  userProfileSelector 
} from "@/store";
import { useRecoilValue } from 'recoil';

export default function UserManagementDemo() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    isAdmin, 
    userProfile,
    login, 
    logout, 
    updateUser 
  } = useAuth();

  // Cách sử dụng trực tiếp atoms và selectors
  const userFromAtom = useRecoilValue(userState);
  const isAuthenticatedFromAtom = useRecoilValue(isAuthenticatedState);
  const isAdminFromSelector = useRecoilValue(isAdminSelector);
  const userProfileFromSelector = useRecoilValue(userProfileSelector);

  const handleLogin = () => {
    const mockUser = {
      _id: '1',
      email: 'demo@example.com',
      fullName: 'Demo User',
      role: 'user',
      firstName: 'Demo',
      lastName: 'User'
    };
    const mockAccessToken = 'mock-access-token';
    const mockRefreshToken = 'mock-refresh-token';
    
    login(mockUser, mockAccessToken, mockRefreshToken);
  };

  const handleLogout = () => {
    logout();
  };

  const handleUpdateUser = () => {
    if (user) {
      const updatedUser = {
        ...user,
        fullName: 'Updated Demo User',
        firstName: 'Updated',
        lastName: 'Demo'
      };
      updateUser(updatedUser);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Recoil User Management Demo
      </h2>

      {/* Authentication Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          Authentication Status
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Is Authenticated:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isAuthenticated ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            <span className="font-medium">Is Admin:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isAdmin ? 'Yes' : 'No'}
            </span>
          </p>
        </div>
      </div>

      {/* User Data from Hook */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-green-800">
          User Data (from useAuth hook)
        </h3>
        <pre className="text-xs bg-white p-3 rounded border overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      {/* User Profile from Selector */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">
          User Profile (from selector)
        </h3>
        <pre className="text-xs bg-white p-3 rounded border overflow-auto">
          {JSON.stringify(userProfile, null, 2)}
        </pre>
      </div>

      {/* Direct Atom Values */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-purple-800">
          Direct Atom/Selector Values
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">User from atom:</span> 
            <span className="ml-2 text-gray-600">
              {userFromAtom ? userFromAtom.email : 'null'}
            </span>
          </p>
          <p>
            <span className="font-medium">Is authenticated from atom:</span> 
            <span className="ml-2 text-gray-600">
              {isAuthenticatedFromAtom ? 'true' : 'false'}
            </span>
          </p>
          <p>
            <span className="font-medium">Is admin from selector:</span> 
            <span className="ml-2 text-gray-600">
              {isAdminFromSelector ? 'true' : 'false'}
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        {!isAuthenticated ? (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Login Demo User
          </button>
        ) : (
          <>
            <button
              onClick={handleUpdateUser}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Update User
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Usage Examples */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Cách sử dụng Recoil cho User Management
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">1. Sử dụng useAuth hook (Khuyến nghị):</h4>
            <pre className="bg-white p-2 rounded border text-xs overflow-auto">
{`import { useAuth } from '@/store';

const { user, isAuthenticated, isAdmin, login, logout } = useAuth();`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-1">2. Sử dụng trực tiếp atoms:</h4>
            <pre className="bg-white p-2 rounded border text-xs overflow-auto">
{`import { useRecoilValue } from 'recoil';
import { userState, isAuthenticatedState } from '@/store';

const user = useRecoilValue(userState);
const isAuthenticated = useRecoilValue(isAuthenticatedState);`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-1">3. Sử dụng selectors:</h4>
            <pre className="bg-white p-2 rounded border text-xs overflow-auto">
{`import { useRecoilValue } from 'recoil';
import { isAdminSelector, userProfileSelector } from '@/store';

const isAdmin = useRecoilValue(isAdminSelector);
const userProfile = useRecoilValue(userProfileSelector);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
