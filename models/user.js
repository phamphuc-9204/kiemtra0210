const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  fullName: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  status: { type: Boolean, default: false },
  loginCount: { type: Number, default: 0, min: 0 },
  isDelete: { type: Boolean, default: false },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true }, // Liên kết với Role
}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);