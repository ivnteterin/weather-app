const searchService = require('../services/searchService');
const catchAsync = require('../utils/catchAsync');

const searchController = {
	saveSearch: catchAsync(async (req, res, next) => {
		if (req.body.userId) {
			const user = await searchService.saveSearchForUser(req);
			res.status(201).json({ data: user });
		} else {
			const search = await searchService.saveSearchToCookie(req, res);
			res.status(201).json({ data: search });
		}
	}),
	getSavedSearches: catchAsync(async (req, res, next) => {
		if (req.body.userId) {
			const searches = await searchService.getSearches(req, next);
			res.status(200).json({ data: searches });
		} else {
			const searches = searchService.getSearchesFromCookie(req, res);
			res.status(200).json({ data: searches });
		}
	}),
	deleteSearch: catchAsync(async (req, res, next) => {
		if (req.body.userId) {
			console.log(req.body);
			const user = await searchService.deleteSearchForUser(req, next);
			res.status(200).json({ data: user });
		} else {
			const remainingSearches = await searchService.deleteSearchFromCookie(req, res);
			res.status(200).json({ data: remainingSearches });
		}
	}),
};

module.exports = searchController;
