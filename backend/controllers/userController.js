const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');

const userController = {
	deleteAccount: catchAsync(async (req, res, next) => {
		const { userId } = req.body;
		const user = await userService.deleteUser(userId);
		res.status(200).json({ data: user });
	}),
	changeLoginName: catchAsync(async (req, res, next) => {}),
};

module.exports = userController;
