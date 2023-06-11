const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const searchController = require('./searchController');
const User = require('../models/UserModel');
const ErrorApp = require('../utils/ErrorApp');

const authController = {
	signup: catchAsync(async (req, res, next) => {
		const { loginName, password } = req.body;
		const searches = await searchController.getSavedSearches(req, res);
		console.log('SIGNUP ', searches);
		const newUser = await User.create({
			loginName,
			password,
			searches,
		});
		console.log(newUser);
		const token = newUser.getJwToken();
		res
			.status(201)
			.json({ status: 'success', token: token, message: 'User created succesfully', data: { user: newUser } });
	}),

	login: catchAsync(async (req, res, next) => {
		const { loginName, password } = req.body;

		// Find the user based on the loginName
		const user = await User.findOne({ loginName }).select('+password');

		if (!user) {
			next(new ErrorApp('Invalid credentials', 401));
		}

		// Validate the password
		const isValidPassword = await user.comparePassword(password, user.password);

		if (!isValidPassword) {
			next(new ErrorApp('Invalid credentials', 401));
		}

		// Generate JWT token
		const token = user.getJwToken();

		// Return the token in the response
		res.status(200).json({ status: 'success', token, data: { user: user } });
	}),

	changePassword: catchAsync(async (req, res, next) => {
		const { userId, password, newPassword, expiration } = req.body;
		const user = await User.findById(userId);
		const isValidPassword = await user.comparePassword(password, user.password);
		if (!isValidPassword) {
			next(new ErrorApp('Invalid credentials', 401));
		}
		if (expiration - Date.now() < (process.env.JWT_EXPIRES * 1000) / 2) {
			next(new ErrorApp('Please re-login to continue the password change', 401));
		}
		user.password = await bcrypt.hash(newPassword, 10);
		await user.save();
		res.status(200).json({ message: 'Password changed successfully' });
	}),

	protect: catchAsync(async (req, res, next) => {
		const auth = req.headers.authorization;
		let token;

		if (auth && auth.startsWith('Bearer')) token = auth.split(' ')[1];
		if (token) {
			const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
			req.body.userId = decodedToken.id;
			req.body.exp = decodedToken.exp;
		}

		next();
	}),
};

module.exports = authController;
