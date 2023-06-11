const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');

const userServices = {
	deleteUser: catchAsync(async (req, res, next) => {
		const { userId } = req.body;
		await User.findByIdAndDelete(userId);
	}),
};
