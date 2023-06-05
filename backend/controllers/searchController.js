const searchService = require('../services/searchService');
const catchAsync = require('../utils/catchAsync');
const ErrorApp = require('../utils/ErrorApp');

const searchController = {
	saveSearch: catchAsync(async (req, res, next) => {
		if (req.body.userId) {
			const user = await searchService.saveSearchForUser(req);
			return res.status(201).json({ data: user });
		} else {
			const search = await searchService.saveSearchToCookie(req, res);
			res.status(201).json({ message: 'Search saved to cookie successfully' });
		}
	}),
	getSavedSearches: catchAsync(async (req, res, next) => {
		if (req.body.userId) {
			const searches = await searchService.getSearches(req);
			return res.status(200).json({ data: searches });
		} else {
			const searches = await searchService.getSearchesFromCookie(req, res);
			res.status(201).json({ data: searches });
		}
	}),
};

module.exports = searchController;
