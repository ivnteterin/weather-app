const express = require('express');
const searchController = require('../controllers/searchController');
const authController = require('../controllers/authController');

const router = express.Router();

router
	.route('/weather')
	.get(authController.protect, searchController.getSavedSearches)
	.post(searchController.saveSearch);

module.exports = router;
