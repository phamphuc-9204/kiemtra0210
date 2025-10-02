const express = require('express');
const router = express.Router();

const roleRoutes = require('./roleRoutes');
const userRoutes = require('./userRoutes');

// Route chính cho API
router.get('/', (req, res) => {
  res.json({
    message: 'API Server đang hoạt động',
    version: '1.0.0',
    endpoints: {
      users: {
        'POST /api/users': 'Tạo user mới',
        'GET /api/users': 'Lấy tất cả users',
        'GET /api/users/id/:id': 'Lấy user theo ID',
        'GET /api/users/username/:username': 'Lấy user theo username',
        'PUT /api/users/:id': 'Cập nhật user',
        'DELETE /api/users/:id': 'Xóa user',
        'POST /api/users/activate': 'Kích hoạt user'
      },
      roles: {
        'POST /api/roles': 'Tạo role mới',
        'GET /api/roles': 'Lấy tất cả roles',
        'GET /api/roles/:id': 'Lấy role theo ID',
        'PUT /api/roles/:id': 'Cập nhật role',
        'DELETE /api/roles/:id': 'Xóa role'
      }
    }
  });
});

router.use('/roles', roleRoutes);
router.use('/users', userRoutes);

module.exports = router;