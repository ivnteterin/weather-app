const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Signup route
router.route('/signup').post(authController.signup);

// Login route
router.route('/login').post(authController.login);

module.exports = router;
