const Role = require('../models/role');

// Tạo một role mới
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Kiểm tra xem role đã tồn tại chưa
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role đã tồn tại.' });
    }

    const newRole = new Role({ name, description });
    await newRole.save();
    res.status(201).json({ message: 'Tạo role thành công!', role: newRole });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy tất cả roles (chưa bị xóa mềm)
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDelete: false });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy một role theo ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDelete: false });
    if (!role) {
      return res.status(404).json({ message: 'Không tìm thấy role.' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật một role
exports.updateRole = async (req, res) => {
  try {
    const updatedRole = await Role.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      req.body,
      { new: true } // Trả về document đã được cập nhật
    );
    if (!updatedRole) {
      return res.status(404).json({ message: 'Không tìm thấy role.' });
    }
    res.status(200).json({ message: 'Cập nhật role thành công!', role: updatedRole });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xóa mềm một role
exports.deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      { isDelete: true },
      { new: true }
    );
    if (!deletedRole) {
      return res.status(404).json({ message: 'Không tìm thấy role.' });
    }
    res.status(200).json({ message: 'Xóa role thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
