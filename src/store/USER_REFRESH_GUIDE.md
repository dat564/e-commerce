# User Auto Refresh với Recoil

Hệ thống tự động refresh user data mỗi khi load lại trang sử dụng Recoil.

## Tính năng đã hoàn thành

### ✅ 1. API Endpoint

- **GET /api/auth/get-user**: Lấy thông tin user dựa trên access token
- Xử lý JWT token validation
- Error handling cho token expired, invalid token
- Trả về thông tin user đầy đủ

### ✅ 2. Hook useGetUser

- Gọi API để lấy user data mới nhất
- Cập nhật Recoil state với data mới
- Error handling thông minh:
  - Token expired/invalid → Clear auth state
  - Network error → Giữ nguyên state hiện tại
  - Server error → Clear auth state

### ✅ 3. Tích hợp vào RecoilRoot

- Tự động gọi API khi load trang
- Fallback về localStorage nếu API thất bại
- Khởi tạo state từ tokens trong localStorage

### ✅ 4. Error Handling

- Phân biệt các loại lỗi khác nhau
- Xử lý network error một cách thông minh
- Log chi tiết để debug

## Cách hoạt động

### Khi load trang:

1. **Kiểm tra tokens**: Load access token và refresh token từ localStorage
2. **Gọi API**: Nếu có tokens, gọi `/api/auth/get-user` để lấy data mới
3. **Cập nhật state**: Nếu API thành công, cập nhật Recoil state với data mới
4. **Fallback**: Nếu API thất bại, sử dụng data từ localStorage
5. **Clear state**: Nếu không có tokens hoặc tokens invalid, clear auth state

### Khi user thay đổi:

- User data được cập nhật real-time trong Recoil state
- localStorage được sync với Recoil state
- Tất cả components sử dụng `useAuth()` sẽ tự động re-render

## Sử dụng

### 1. Trong Component

```javascript
import { useAuth, useGetUser } from "@/store";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { getUser } = useGetUser();

  const handleRefresh = async () => {
    await getUser(); // Refresh user data manually
  };

  return (
    <div>
      {isLoading ? "Loading..." : user?.email}
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}
```

### 2. Auto Refresh (Tự động)

Không cần làm gì thêm! Hệ thống sẽ tự động:

- Refresh user data khi load trang
- Cập nhật state khi có thay đổi
- Xử lý lỗi một cách thông minh

## API Endpoints

### GET /api/auth/get-user

Lấy thông tin user hiện tại

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response Success:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "fullName": "User Name",
      "role": "user",
      "avatar": "avatar_url",
      "phone": "phone_number",
      "address": "user_address",
      "permissions": ["permission1", "permission2"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "User data retrieved successfully"
}
```

**Response Error:**

```json
{
  "success": false,
  "message": "Access token expired"
}
```

## Demo Component

Xem `src/components/demo/UserRefreshDemo.jsx` để có ví dụ chi tiết về:

- Cách sử dụng useGetUser hook
- Hiển thị trạng thái loading
- Xử lý refresh manual
- Error handling

## Lợi ích

1. **Data Freshness**: Luôn có data mới nhất từ server
2. **Performance**: Chỉ gọi API khi cần thiết
3. **Reliability**: Fallback về localStorage nếu API thất bại
4. **User Experience**: Không cần login lại khi refresh trang
5. **Error Handling**: Xử lý lỗi một cách thông minh
6. **Developer Experience**: Dễ sử dụng và debug

## Cấu hình

### Environment Variables

Đảm bảo có các biến môi trường sau:

```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

### Database

API sử dụng MongoDB với model User. Đảm bảo:

- User model có các field cần thiết
- Database connection hoạt động
- JWT secret được cấu hình đúng

## Troubleshooting

### 1. API không hoạt động

- Kiểm tra JWT_SECRET trong .env
- Kiểm tra database connection
- Kiểm tra User model

### 2. User data không cập nhật

- Kiểm tra access token có hợp lệ không
- Kiểm tra network connection
- Xem console logs để debug

### 3. Infinite loading

- Kiểm tra API response format
- Kiểm tra error handling trong useGetUser
- Xem network tab trong DevTools

## Tương lai

Có thể mở rộng thêm:

- Auto refresh theo interval
- WebSocket để real-time updates
- Cache invalidation
- Optimistic updates
