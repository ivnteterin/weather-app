const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	loginName: {
		type: String,
		required: true,
		unique: true,
		maxlength: [15, 'Name must be between 2 than 15 characters'],
		minlength: [2, 'Name must be between 2 than 15 characters'],
		validate: validator.isAlpha,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		select: false,
	},

	registeredAt: {
		type: Date,
		default: Date.now,
	},
	searches: [
		{
			city: {
				type: String,
				required: true,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

//Password encryption
userSchema.pre('save', async function (next) {
	//Run only if password is modified
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

//Compare passwords
userSchema.methods.comparePassword = async function (tryPassword, userPassword) {
	try {
		return await bcrypt.compare(tryPassword, userPassword);
	} catch (error) {
		console.error(error);
		throw new Error('Password comparison failed');
	}
};

//Get JWT
userSchema.methods.getJwToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES,
	});
};

const User = mongoose.model('User', userSchema);

module.exports = User;
