const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Yêu cầu 2: Hàm kích hoạt status
router.post('/activate', userController.activateUserStatus);

// Yêu cầu 1: CRUD
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/id/:id', userController.getUserById);
router.get('/username/:username', userController.getUserByUsername);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;