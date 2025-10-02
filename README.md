# User Management System

Hệ thống quản lý người dùng và vai trò với giao diện web hiện đại.

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình database
Tạo file `.env` với nội dung:
```env
MONGODB_URI=mongodb://localhost:27017/kiemtra_db
PORT=3000
```

### 3. Seed dữ liệu mẫu
```bash
npm run seed
```

### 4. Chạy server
```bash
npm run dev
```

### 5. Truy cập ứng dụng
- **Giao diện web**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api

## 📊 Dữ liệu mẫu

### Roles:
- **Admin**: Quản trị viên hệ thống với quyền cao nhất
- **Manager**: Quản lý với quyền trung gian  
- **User**: Người dùng thông thường
- **Editor**: Biên tập viên có thể chỉnh sửa nội dung
- **Guest**: Khách với quyền hạn chế

### Users mẫu:
| Username | Password | Email | Role | Status |
|----------|----------|-------|------|--------|
| admin | admin123 | admin@example.com | Admin | ✅ Active |
| manager1 | manager123 | manager1@example.com | Manager | ✅ Active |
| user1 | user123 | user1@example.com | User | ✅ Active |
| editor1 | editor123 | editor1@example.com | Editor | ❌ Inactive |
| guest1 | guest123 | guest1@example.com | Guest | ❌ Inactive |
| john_doe | john123 | john.doe@example.com | User | ✅ Active |
| jane_smith | jane123 | jane.smith@example.com | Manager | ✅ Active |
| test_user | test123 | test@example.com | Guest | ❌ Inactive |

## 🔧 API Endpoints

### Users
- `GET /api/users` - Lấy tất cả users (có thể tìm kiếm: ?username=... &fullName=...)
- `POST /api/users` - Tạo user mới
- `GET /api/users/id/:id` - Lấy user theo ID
- `GET /api/users/username/:username` - Lấy user theo username
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user (soft delete)
- `POST /api/users/activate` - Kích hoạt user (cần email và username)

### Roles
- `GET /api/roles` - Lấy tất cả roles
- `POST /api/roles` - Tạo role mới
- `GET /api/roles/:id` - Lấy role theo ID
- `PUT /api/roles/:id` - Cập nhật role
- `DELETE /api/roles/:id` - Xóa role (soft delete)

## 🎨 Tính năng giao diện

- ✅ Responsive design (mobile & desktop)
- ✅ Modern UI với gradient và animations
- ✅ Real-time API testing
- ✅ Form validation
- ✅ Loading states và error handling
- ✅ Interactive dashboard

## 📝 Cấu trúc project

```
├── config/
│   └── database.js          # Cấu hình MongoDB
├── controllers/
│   ├── userController.js    # Controller cho User
│   └── roleController.js    # Controller cho Role
├── models/
│   ├── user.js             # Model User
│   └── role.js             # Model Role
├── routes/
│   ├── index.js            # Routes chính
│   ├── userRoutes.js       # Routes cho User
│   └── roleRoutes.js       # Routes cho Role
├── public/
│   └── index.html          # Giao diện web
├── seedData.js             # Script seed dữ liệu mẫu
├── server.js               # Server chính
└── package.json
```

## 🛠️ Scripts

- `npm run dev` - Chạy server development với nodemon
- `npm run seed` - Seed dữ liệu mẫu vào database
- `npm test` - Chạy tests (chưa implement)

## 🔒 Bảo mật

- ✅ Password hashing với bcryptjs
- ✅ Input validation
- ✅ Soft delete cho data integrity
- ✅ Error handling toàn diện
