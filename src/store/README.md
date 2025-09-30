# Recoil User Management

Hệ thống quản lý user state sử dụng Recoil thay thế cho Context API.

## Cấu trúc

```
src/store/
├── atoms/
│   └── userAtoms.js          # Các atoms cơ bản cho user state
├── selectors/
│   └── userSelectors.js      # Các selectors cho computed values
├── hooks/
│   ├── useAuth.js           # Hook chính để sử dụng auth
│   └── useAuthActions.js    # Hook cho các actions
├── migration/
│   └── AuthMigration.jsx    # Component migration từ Context
├── RecoilRoot.jsx           # Custom RecoilRoot với initialization
└── index.js                 # Export tất cả
```

## Atoms

### userState
- **Key**: `userState`
- **Type**: `Object | null`
- **Mô tả**: Lưu trữ thông tin user hiện tại

### userLoadingState
- **Key**: `userLoadingState`
- **Type**: `boolean`
- **Mô tả**: Trạng thái loading khi khởi tạo user

### accessTokenState
- **Key**: `accessTokenState`
- **Type**: `string | null`
- **Mô tả**: Access token cho API calls

### refreshTokenState
- **Key**: `refreshTokenState`
- **Type**: `string | null`
- **Mô tả**: Refresh token để làm mới access token

### isAuthenticatedState
- **Key**: `isAuthenticatedState`
- **Type**: `boolean`
- **Mô tả**: Trạng thái xác thực của user

## Selectors

### isAdminSelector
- **Mô tả**: Kiểm tra user có phải admin không
- **Return**: `boolean`

### userFullNameSelector
- **Mô tả**: Lấy tên đầy đủ của user
- **Return**: `string`

### userEmailSelector
- **Mô tả**: Lấy email của user
- **Return**: `string`

### userRoleSelector
- **Mô tả**: Lấy role của user
- **Return**: `string`

### hasPermissionSelector
- **Mô tả**: Kiểm tra user có quyền cụ thể không
- **Return**: `function(permission: string) => boolean`

### authHeadersSelector
- **Mô tả**: Lấy headers cho API calls
- **Return**: `Object`

### userProfileSelector
- **Mô tả**: Lấy thông tin profile đầy đủ của user
- **Return**: `Object | null`

## Hooks

### useAuth()
Hook chính để sử dụng authentication trong components.

```javascript
import { useAuth } from '@/store';

const {
  // State
  user,              // Thông tin user
  isLoading,         // Trạng thái loading
  isAuthenticated,   // Trạng thái xác thực
  isAdmin,          // User có phải admin
  userProfile,      // Profile đầy đủ
  authHeaders,      // Headers cho API
  
  // Actions
  login,            // Đăng nhập
  logout,           // Đăng xuất
  updateUser,       // Cập nhật thông tin user
  updateTokens,     // Cập nhật tokens
  setLoading,       // Set loading state
  
  // Helpers
  getAccessToken,   // Lấy access token
  getRefreshToken,  // Lấy refresh token
  isAuthenticated,  // Kiểm tra xác thực
} = useAuth();
```

### useAuthActions()
Hook chỉ chứa các actions, không có state.

```javascript
import { useAuthActions } from '@/store';

const { login, logout, updateUser, updateTokens, setLoading } = useAuthActions();
```

## Cách sử dụng

### 1. Sử dụng trong Component

```javascript
"use client";

import { useAuth } from '@/store';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Sử dụng trực tiếp Atoms

```javascript
import { useRecoilValue } from 'recoil';
import { userState, isAuthenticatedState } from '@/store';

export default function MyComponent() {
  const user = useRecoilValue(userState);
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  
  // ...
}
```

### 3. Sử dụng Selectors

```javascript
import { useRecoilValue } from 'recoil';
import { isAdminSelector, userProfileSelector } from '@/store';

export default function AdminComponent() {
  const isAdmin = useRecoilValue(isAdminSelector);
  const userProfile = useRecoilValue(userProfileSelector);
  
  if (!isAdmin) {
    return <div>Access denied</div>;
  }
  
  // ...
}
```

### 4. Login/Logout

```javascript
import { useAuth } from '@/store';

export default function LoginComponent() {
  const { login, logout } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        login(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  const handleLogout = () => {
    logout();
  };
  
  // ...
}
```

## Migration từ Context API

### Bước 1: Cập nhật Layout
```javascript
// src/app/layout.js
import { CustomRecoilRoot } from "@/store";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CustomRecoilRoot>
          {children}
        </CustomRecoilRoot>
      </body>
    </html>
  );
}
```

### Bước 2: Cập nhật Components
```javascript
// Thay đổi import
- import { useAuth } from "@/contexts/AuthContext";
+ import { useAuth } from "@/store";

// Sử dụng như cũ (tương thích)
const { user, login, logout, isAdmin } = useAuth();
```

### Bước 3: Xóa AuthContext (tùy chọn)
Sau khi migration hoàn tất, có thể xóa `src/contexts/AuthContext.jsx`.

## Lợi ích của Recoil

1. **Performance**: Chỉ re-render components cần thiết
2. **DevTools**: Hỗ trợ Recoil DevTools để debug
3. **Selectors**: Computed values tự động cập nhật
4. **Type Safety**: Dễ dàng thêm TypeScript
5. **Testing**: Dễ test hơn Context API
6. **Scalability**: Dễ mở rộng cho các state phức tạp

## Demo

Xem `src/components/demo/UserManagementDemo.jsx` để có ví dụ chi tiết về cách sử dụng.
