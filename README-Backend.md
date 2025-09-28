# Backend API Documentation - E-commerce Next.js

## Tổng quan

Backend được xây dựng trên Next.js API Routes với MongoDB làm database chính.

## Cấu trúc dự án

```
src/
├── app/api/                 # API Routes
│   ├── auth/               # Authentication APIs
│   │   ├── login/route.js
│   │   ├── register/route.js
│   │   └── profile/route.js
│   ├── products/           # Product APIs
│   │   ├── route.js
│   │   └── [id]/route.js
│   ├── orders/             # Order APIs
│   │   ├── route.js
│   │   └── [id]/route.js
│   └── categories/         # Category APIs
│       └── route.js
├── lib/
│   └── mongodb.js          # Database connection
├── models/                 # MongoDB Models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Category.js
├── middleware/
│   └── auth.js             # Authentication middleware
└── utils/
    ├── response.js         # Response helpers
    └── validation.js       # Validation helpers
```

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install bcryptjs jsonwebtoken mongoose cors next-auth
```

### 2. Cấu hình environment variables

Tạo file `.env.local` từ `env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Khởi động MongoDB

- Local: `mongod`
- Hoặc sử dụng MongoDB Atlas

## API Endpoints

### Authentication

#### POST /api/auth/register

Đăng ký tài khoản mới

**Request Body:**

```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận 1, TP.HCM"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "phone": "0123456789",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

#### POST /api/auth/login

Đăng nhập

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/profile

Lấy thông tin profile (cần token)

**Headers:**

```
Authorization: Bearer <token>
```

#### PUT /api/auth/profile

Cập nhật thông tin profile (cần token)

### Products

#### GET /api/products

Lấy danh sách sản phẩm

**Query Parameters:**

- `page`: Trang (default: 1)
- `limit`: Số sản phẩm/trang (default: 12)
- `category`: Lọc theo danh mục
- `search`: Tìm kiếm
- `minPrice`: Giá tối thiểu
- `maxPrice`: Giá tối đa
- `sortBy`: Sắp xếp theo (price, createdAt, rating)
- `sortOrder`: Thứ tự (asc, desc)
- `featured`: Chỉ lấy sản phẩm nổi bật (true/false)

#### GET /api/products/[id]

Lấy chi tiết sản phẩm

#### POST /api/products

Tạo sản phẩm mới (cần admin)

#### PUT /api/products/[id]

Cập nhật sản phẩm (cần admin)

#### DELETE /api/products/[id]

Xóa sản phẩm (cần admin)

### Orders

#### GET /api/orders

Lấy danh sách đơn hàng của user (cần token)

#### POST /api/orders

Tạo đơn hàng mới (cần token)

**Request Body:**

```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC",
    "city": "TP.HCM",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé"
  },
  "paymentMethod": "cod",
  "notes": "Ghi chú đơn hàng"
}
```

#### GET /api/orders/[id]

Lấy chi tiết đơn hàng (cần token)

#### PUT /api/orders/[id]

Cập nhật trạng thái đơn hàng (cần token)

### Categories

#### GET /api/categories

Lấy danh sách danh mục

#### POST /api/categories

Tạo danh mục mới (cần admin)

## Models

### User

- `name`: Tên người dùng
- `email`: Email (unique)
- `password`: Mật khẩu (hashed)
- `phone`: Số điện thoại
- `address`: Địa chỉ
- `role`: Vai trò (user/admin)
- `avatar`: Ảnh đại diện
- `isActive`: Trạng thái hoạt động

### Product

- `name`: Tên sản phẩm
- `description`: Mô tả
- `price`: Giá bán
- `originalPrice`: Giá gốc
- `images`: Mảng URL ảnh
- `category`: Danh mục
- `brand`: Thương hiệu
- `stock`: Số lượng tồn kho
- `sku`: Mã sản phẩm (auto-generated)
- `tags`: Mảng tag
- `isActive`: Trạng thái hoạt động
- `isFeatured`: Sản phẩm nổi bật
- `rating`: Đánh giá (average, count)

### Order

- `user`: ID người dùng
- `orderNumber`: Mã đơn hàng (auto-generated)
- `items`: Mảng sản phẩm trong đơn hàng
- `shippingAddress`: Địa chỉ giao hàng
- `paymentMethod`: Phương thức thanh toán
- `paymentStatus`: Trạng thái thanh toán
- `orderStatus`: Trạng thái đơn hàng
- `subtotal`: Tổng tiền hàng
- `shippingFee`: Phí ship
- `discount`: Giảm giá
- `total`: Tổng cộng

### Category

- `name`: Tên danh mục
- `slug`: URL slug (auto-generated)
- `description`: Mô tả
- `image`: Ảnh danh mục
- `parent`: Danh mục cha
- `isActive`: Trạng thái hoạt động
- `sortOrder`: Thứ tự sắp xếp

## Middleware

### authMiddleware

Xác thực JWT token và gán user vào request

### adminMiddleware

Kiểm tra quyền admin

## Validation

Tất cả input đều được validate với các rules:

- Required fields
- Email format
- Phone format
- Password strength
- String length limits
- Number ranges

## Error Handling

Tất cả API đều trả về format chuẩn:

**Success:**

```json
{
  "success": true,
  "message": "Thông báo",
  "data": {}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "errors": [] // Optional
}
```

## Security

- JWT authentication
- Password hashing với bcrypt
- Input validation
- CORS enabled
- Rate limiting (có thể thêm)

## Chạy dự án

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

API sẽ có sẵn tại: `http://localhost:3000/api/`
