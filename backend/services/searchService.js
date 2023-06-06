const cookieEncrypt = require('../utils/cookieEncrypt');
const User = require('../models/UserModel');
const Search = require('../models/SearchModel');

const searchService = {
	saveSearchForUser: async (req) => {
		const { userId, city } = req.body;

		//if there is an existing cookie before user decided to signup

		const user = await User.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		user.serches;

		const filteredSearches = user.searches.filter((search) => search.city !== city);

		const search = new Search(city);

		filteredSearches.push(search);
		user.searches = filteredSearches;
		return await user.save();
	},

	saveSearchToCookie: async (req, res) => {
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
	},

	getSearches: async (req) => {
		try {
			const { userId } = req.body;
			const user = await User.findById(userId).populate('searches');

			if (!user) {
				throw new Error('User not found');
			}

			return user.searches.map((s) => s.city).reverse();
		} catch (error) {
			console.log(error);
			throw new Error('An error occurred while retrieving the searches.');
		}
	},
	getSearchesFromCookie: (req, res) => {
		let existingCookie = req.cookies.citySearches;
		console.log('existingCookie ', existingCookie);
		if (existingCookie) existingCookie = cookieEncrypt.decryptCookie(existingCookie);
		console.log('existingCookie ', existingCookie);
		let citySearches = JSON.parse(existingCookie);
		citySearches = citySearches.map((city) => new Search(city));
		console.log('citySearches');
		console.log(citySearches);
		return citySearches;
	},
};

module.exports = searchService;
