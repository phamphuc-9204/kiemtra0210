require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Role = require('./models/role');
const connectDB = require('./config/database');

// Dữ liệu mẫu cho Roles
const sampleRoles = [
  {
    name: 'Admin',
    description: 'Quản trị viên hệ thống với quyền cao nhất'
  },
  {
    name: 'Manager',
    description: 'Quản lý với quyền trung gian'
  },
  {
    name: 'User',
    description: 'Người dùng thông thường'
  },
  {
    name: 'Guest',
    description: 'Khách với quyền hạn chế'
  },
  {
    name: 'Editor',
    description: 'Biên tập viên có thể chỉnh sửa nội dung'
  }
];

// Dữ liệu mẫu cho Users (sẽ được tạo sau khi có roles)
const sampleUsers = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    fullName: 'Nguyễn Văn Admin',
    avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=AD',
    status: true,
    loginCount: 25,
    roleName: 'Admin'
  },
  {
    username: 'manager1',
    password: 'manager123',
    email: 'manager1@example.com',
    fullName: 'Trần Thị Manager',
    avatarUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=MG',
    status: true,
    loginCount: 15,
    roleName: 'Manager'
  },
  {
    username: 'user1',
    password: 'user123',
    email: 'user1@example.com',
    fullName: 'Lê Văn User',
    avatarUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=US',
    status: true,
    loginCount: 8,
    roleName: 'User'
  },
  {
    username: 'editor1',
    password: 'editor123',
    email: 'editor1@example.com',
    fullName: 'Phạm Thị Editor',
    avatarUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=ED',
    status: false,
    loginCount: 0,
    roleName: 'Editor'
  },
  {
    username: 'guest1',
    password: 'guest123',
    email: 'guest1@example.com',
    fullName: 'Hoàng Văn Guest',
    avatarUrl: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=GU',
    status: false,
    loginCount: 2,
    roleName: 'Guest'
  },
  {
    username: 'john_doe',
    password: 'john123',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    avatarUrl: 'https://via.placeholder.com/150/00FFFF/000000?text=JD',
    status: true,
    loginCount: 12,
    roleName: 'User'
  },
  {
    username: 'jane_smith',
    password: 'jane123',
    email: 'jane.smith@example.com',
    fullName: 'Jane Smith',
    avatarUrl: 'https://via.placeholder.com/150/800080/FFFFFF?text=JS',
    status: true,
    loginCount: 7,
    roleName: 'Manager'
  },
  {
    username: 'test_user',
    password: 'test123',
    email: 'test@example.com',
    fullName: 'Test User',
    avatarUrl: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=TU',
    status: false,
    loginCount: 0,
    roleName: 'Guest'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Bắt đầu seed database my_api_db...');
    
    // Kết nối database
    await connectDB();
    console.log('✅ Đã kết nối database my_api_db');

    // Kiểm tra xem đã có data chưa
    const existingRoles = await Role.countDocuments();
    const existingUsers = await User.countDocuments();
    
    console.log(`📊 Hiện tại có: ${existingRoles} roles, ${existingUsers} users`);

    if (existingRoles > 0 || existingUsers > 0) {
      console.log('⚠️  Database đã có dữ liệu. Bạn có muốn:');
      console.log('   1. Thêm vào dữ liệu hiện có (không xóa)');
      console.log('   2. Xóa hết và tạo mới');
      console.log('');
      console.log('🔄 Đang thêm vào dữ liệu hiện có...');
    }

    // Tạo Roles (chỉ tạo nếu chưa có)
    console.log('👥 Kiểm tra và tạo roles...');
    const roleMap = {};
    
    for (const roleData of sampleRoles) {
      let role = await Role.findOne({ name: roleData.name, isDelete: false });
      if (!role) {
        role = await Role.create(roleData);
        console.log(`   ✅ Tạo role: ${role.name}`);
      } else {
        console.log(`   ⏭️  Role đã tồn tại: ${role.name}`);
      }
      roleMap[role.name] = role._id;
    }

    // Tạo Users (chỉ tạo nếu chưa có)
    console.log('👤 Kiểm tra và tạo users...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ 
        $or: [
          { username: userData.username },
          { email: userData.email }
        ],
        isDelete: false 
      });

      if (!existingUser) {
        const newUser = {
          ...userData,
          role: roleMap[userData.roleName]
        };
        delete newUser.roleName;

        await User.create(newUser);
        console.log(`   ✅ Tạo user: ${userData.username} (${userData.fullName})`);
        createdCount++;
      } else {
        console.log(`   ⏭️  User đã tồn tại: ${userData.username}`);
        skippedCount++;
      }
    }

    // Hiển thị thống kê cuối cùng
    const totalRoles = await Role.countDocuments({ isDelete: false });
    const totalUsers = await User.countDocuments({ isDelete: false });

    console.log('\n📊 THỐNG KÊ CUỐI CÙNG:');
    console.log('='.repeat(50));
    console.log(`🏷️  Tổng roles trong database: ${totalRoles}`);
    console.log(`👥 Tổng users trong database: ${totalUsers}`);
    console.log(`✅ Users mới tạo: ${createdCount}`);
    console.log(`⏭️  Users đã tồn tại: ${skippedCount}`);

    // Hiển thị tất cả users hiện có
    console.log('\n👥 TẤT CẢ USERS TRONG DATABASE:');
    console.log('='.repeat(50));
    const allUsers = await User.find({ isDelete: false })
      .populate('role', 'name')
      .select('username fullName email status loginCount role');

    allUsers.forEach((user, index) => {
      const statusIcon = user.status ? '🟢' : '🔴';
      console.log(`${index + 1}. ${user.username} (${user.fullName}) - ${user.role.name} ${statusIcon}`);
      console.log(`   📧 ${user.email} | 🔢 Login: ${user.loginCount}`);
    });

    console.log('\n🎉 SEED DATABASE THÀNH CÔNG!');
    console.log('\n📝 THÔNG TIN ĐĂNG NHẬP MẪU:');
    console.log('='.repeat(50));
    console.log('Admin: admin / admin123');
    console.log('Manager: manager1 / manager123');
    console.log('User: user1 / user123');
    console.log('Editor: editor1 / editor123');
    console.log('Guest: guest1 / guest123');
    
    console.log('\n🌐 Truy cập: http://localhost:3000');
    console.log('📚 API Docs: http://localhost:3000/api');

  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối database');
    process.exit(0);
  }
}

// Chạy script
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;