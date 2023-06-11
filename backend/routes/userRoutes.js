const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// Signup route
router.route('/signup').post(authController.signup);

// Login route
router
	.route('/login')
	.post(authController.login)
	.patch(authController.protect, authController.changePassword)
	.delete(authController.protect, userController.deleteAccount);

module.exports = router;
