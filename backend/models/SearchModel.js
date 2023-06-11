const mongoose = require('mongoose');

class Search {
	constructor(city) {
		this._id = new mongoose.Types.ObjectId();
		this.city = city;
		this.date = new Date();
	}
}

module.exports = Search;
