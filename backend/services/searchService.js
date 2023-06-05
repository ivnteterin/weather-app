const User = require('../models/UserModel');
const Search = require('../models/SearchModel');

const searchService = {
	saveSearchForUser: async (req) => {
		const { userId, city } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const filteredSearches = user.searches.filter((search) => search.city !== city);

		const search = new Search(city);

		filteredSearches.push(search);
		user.searches = filteredSearches;
		return await user.save();
	},

	saveSearchToCookie: async (req, res) => {
		const { city } = req.body;
		const existingCookie = req.cookies.citySearches;
		let citySearches = existingCookie ? JSON.parse(existingCookie) : [];
		citySearches = citySearches.filter((item) => item !== city);
		citySearches.unshift(city);

		const updatedCookie = JSON.stringify(citySearches);

		res.cookie('citySearches', updatedCookie);
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
	getSearchesFromCookie: async (req, res) => {
		const existingCookie = req.cookies.citySearches;
		const citySearches = existingCookie ? JSON.parse(existingCookie) : [];
		return citySearches;
	},
};

module.exports = searchService;
