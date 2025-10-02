const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  isDelete: { type: Boolean, default: false },
}, { timestamps: true }); // timestamps tự động thêm createdAt và updatedAt

module.exports = mongoose.model('Role', roleSchema);