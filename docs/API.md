# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Sử dụng JWT Bearer token:

```
Authorization: Bearer <token>
```

## Common Response Format

Success:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Status Codes

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Endpoints

### Authentication

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": { id, email, role, ... }
}
```

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

Response:
{
  "user": { id, email, fullName, ... }
}
```

#### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}

Response:
{
  "accessToken": "new_jwt_token"
}
```

### Products

#### Get all products
```
GET /products?page=1&limit=20&category=electronics
```

#### Get product by ID
```
GET /products/:id
```

#### Create product (Admin)
```
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "category": "electronics",
  "stock": 10,
  "images": ["url1", "url2"]
}
```

#### Update product (Admin)
```
PUT /products/:id
Authorization: Bearer <admin_token>
```

#### Delete product (Admin)
```
DELETE /products/:id
Authorization: Bearer <admin_token>
```

### Orders

#### Create order
```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "shippingAddressId": 1,
  "paymentMethod": "vnpay"
}

Response:
{
  "orderId": 1,
  "paymentUrl": "https://vnpay.vn/..."
}
```

#### Get user orders
```
GET /orders
Authorization: Bearer <token>
```

#### Get order details
```
GET /orders/:id
Authorization: Bearer <token>
```

### Payments

#### VNPAY Callback
```
GET /payment/vnpay/ipn?vnp_TransactionNo=...&vnp_TransactionStatus=00

Response:
{
  "RspCode": "00",
  "Message": "Confirm Success"
}
```

### Users

#### Get profile
```
GET /users/profile
Authorization: Bearer <token>
```

#### Update profile
```
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "New Name",
  "phone": "0123456789"
}
```

#### Change password
```
POST /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### Admin

#### Get all users
```
GET /admin/users
Authorization: Bearer <admin_token>
```

#### Get dashboard stats
```
GET /admin/dashboard
Authorization: Bearer <admin_token>

Response:
{
  "totalOrders": 100,
  "totalRevenue": 50000,
  "totalUsers": 50,
  "pendingOrders": 5
}
```

### Modules

#### Get enabled modules
```
GET /modules
```

#### Get module details
```
GET /modules/:name
```

## Error Codes

- INVALID_CREDENTIALS: Sai email/password
- USER_NOT_FOUND: Người dùng không tồn tại
- PRODUCT_NOT_FOUND: Sản phẩm không tồn tại
- INSUFFICIENT_STOCK: Hết hàng
- PAYMENT_FAILED: Thanh toán thất bại
- UNAUTHORIZED: Chưa xác thực
- FORBIDDEN: Không có quyền
- INVALID_INPUT: Dữ liệu không hợp lệ

## Rate Limiting

Default: 120 requests per minute per IP

Headers:
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
X-RateLimit-Reset: 1609459200
```

## Pagination

Query parameters:
- `page`: Số trang (default: 1)
- `limit`: Số item trên trang (default: 20)

Response:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## WebHooks (Planned)

Các sự kiện:
- order.created
- order.paid
- order.shipped
- user.registered

## SDK & Client Libraries

Hiện chưa có official SDK. Sử dụng HTTP client thông thường.

## Support

- GitHub Issues: Bug reports
- Email: contact@ltwnc.com
