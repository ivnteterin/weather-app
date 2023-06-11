const express = require('express');
const searchController = require('../controllers/searchController');
const authController = require('../controllers/authController');

const router = express.Router();

router
	.route('/weather')
	.get(authController.protect, searchController.getSavedSearches)
	.post(authController.protect, searchController.saveSearch)
	.patch(authController.protect, searchController.deleteSearch);

module.exports = router;
