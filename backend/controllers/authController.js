const { promisify } = require('util');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const searchController = require('./searchController');

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
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		// Validate the password
		const isValidPassword = await user.comparePassword(password, user.password);

		if (!isValidPassword) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		// Generate JWT token
		const token = user.getJwToken();

		// Return the token in the response
		res.status(200).json({ status: 'success', token, data: { user: user } });
	}),
	protect: catchAsync(async (req, res, next) => {
		const auth = req.headers.authorization;
		let token;

		if (auth && auth.startsWith('Bearer')) token = auth.split(' ')[1];
		if (token) {
			const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
			req.body.userId = decodedToken.id;
		}

		next();
	}),
};

module.exports = authController;
