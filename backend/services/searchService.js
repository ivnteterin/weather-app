const User = require('../models/UserModel');
const Search = require('../models/SearchModel');
const catchAsync = require('../utils/catchAsync');
const cookieEncrypt = require('../utils/cookieEncrypt');

const searchService = {
	saveSearchForUser: async (req) => {
		const { userId, city } = req.body;
		const user = await User.findById(userId);

		const filteredSearches = user.searches.filter((search) => search.city !== city);
		const search = new Search(city);

		filteredSearches.push(search);
		user.searches = filteredSearches;
		return await user.save();
	},

	saveSearchToCookie: catchAsync(async (req, res, next) => {
		const { city } = req.body;
		const existingCookie = req.cookies.citySearches;
		let citySearches = existingCookie ? JSON.parse(cookieEncrypt.decryptCookie(existingCookie)) : [];
		console.log('citySearches', citySearches);
		citySearches = citySearches.filter((item) => item !== city);
		citySearches.unshift(city);

		const updatedCookie = cookieEncrypt.encryptCookie(JSON.stringify(citySearches));

		res.cookie('citySearches', updatedCookie, {
			httpOnly: true, // Prevent client-side JavaScript access
			sameSite: 'Strict', // Only send with same-site requests
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiration time (e.g., 24 hours)
		});
		return citySearches;
	}),

	getSearches: catchAsync(async (req, res, next) => {
		console.log('[getSearches...]'.toLocaleUpperCase());

		const { userId } = req.body;
		const user = await User.findById(userId).populate('searches');

		return user.searches.reverse();
	}),

	getSearchesFromCookie: (req, res) => {
		console.log('[getSearchesFromCookie...]'.toLocaleUpperCase());
		let existingCookie = req.cookies.citySearches;
		console.log('existingCookie ', existingCookie);
		let citySearches = [];
		if (existingCookie) {
			existingCookie = cookieEncrypt.decryptCookie(existingCookie);
			console.log('existingCookie ', existingCookie);
			citySearches = JSON.parse(existingCookie);
		}
		return citySearches;
	},

	deleteSearchForUser: catchAsync(async (req, res, next) => {
		console.log('[deleteSearchForUser...]'.toLocaleUpperCase());

		const { userId, city } = req.body;
		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			{ $pull: { searches: { city: city } } },
			{ new: true }
		);
		return updatedUser;
	}),

	deleteSearchFromCookie: catchAsync(async (req, res, next) => {
		const cityToDel = req.body.city;
		let existingCookie = req.cookies.citySearches;
		let citySearches = [];
		if (existingCookie) {
			existingCookie = cookieEncrypt.decryptCookie(existingCookie);
			citySearches = JSON.parse(existingCookie).filter((city) => city !== cityToDel);
			const updatedCookie = cookieEncrypt.encryptCookie(JSON.stringify(citySearches));
			res.cookie('citySearches', updatedCookie);
		}
		return citySearches;
	}),
};

module.exports = searchService;
