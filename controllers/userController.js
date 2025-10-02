const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcryptjs');

// Tạo user mới
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, role } = req.body;

    // Kiểm tra username hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username hoặc email đã tồn tại.' });
    }

    // Kiểm tra xem role có tồn tại không
    const roleExists = await Role.findById(role);
    if (!roleExists || roleExists.isDelete) {
        return res.status(400).json({ message: 'Role không hợp lệ.' });
    }

    const newUser = new User({
      username,
      password, // Mật khẩu sẽ được hash tự động bởi pre-save hook trong model
      email,
      fullName,
      role
    });

    await newUser.save();
    // Không trả về mật khẩu trong response
    newUser.password = undefined;

    res.status(201).json({ message: 'Tạo user thành công!', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy tất cả users (chưa bị xóa mềm) và thông tin role của họ
// Có thể tìm kiếm theo username, fullname (check chứa)
exports.getAllUsers = async (req, res) => {
  try {
    const { username, fullName } = req.query;
    
    // Tạo điều kiện tìm kiếm
    let searchCondition = { isDelete: false };
    
    if (username) {
      searchCondition.username = { $regex: username, $options: 'i' }; // Tìm kiếm chứa, không phân biệt hoa thường
    }
    
    if (fullName) {
      searchCondition.fullName = { $regex: fullName, $options: 'i' }; // Tìm kiếm chứa, không phân biệt hoa thường
    }

    const users = await User.find(searchCondition)
      .populate('role', 'name description') // Lấy thông tin 'name' và 'description' từ model Role
      .select('-password'); // Loại bỏ trường password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy user theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDelete: false })
      .populate('role', 'name description')
      .select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy user theo username
exports.getUserByUsername = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username, isDelete: false })
        .populate('role', 'name description')
        .select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user.' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  };

// Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    // Nếu có mật khẩu mới, hash nó
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy user.' });
    }
    res.status(200).json({ message: 'Cập nhật user thành công!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xóa mềm user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      { isDelete: true },
      { new: true }
    );
    if (!deletedUser) {
      return res.status(404).json({ message: 'Không tìm thấy user.' });
    }
    res.status(200).json({ message: 'Xóa user thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Kích hoạt status cho user - truyền lên email và username, nếu thông tin đúng thì chuyển status về true
exports.activateUserStatus = async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).json({ message: 'Email và username là bắt buộc.' });
        }

        // Tìm user với email và username khớp
        const user = await User.findOne({ 
            email: email.toLowerCase(), 
            username: username,
            isDelete: false 
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy user với email và username này.' });
        }

        // Cập nhật status thành true
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { status: true },
            { new: true }
        ).populate('role', 'name description').select('-password');

        res.status(200).json({ 
            message: 'Kích hoạt user thành công!', 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
