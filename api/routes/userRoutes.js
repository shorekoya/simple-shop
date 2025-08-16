const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/check-auth');

router.get('/', userController.getAllUsers);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.delete('/:id', checkAuth, userController.deleteUser);

module.exports = router;
