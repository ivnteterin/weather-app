require('dotenv').config({ path: './config/.env' }); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
var cookieParser = require('cookie-parser');

const searchRoutes = require('./routes/searchRoutes');
const userRoutes = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');
const ErrorApp = require('./utils/ErrorApp');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(errorController);
// Routes
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);

app.all('*', (req, res, next) => {
	next(new ErrorApp(`Cannot find ${req.originalUrl}`, 404));
});

//Errors

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

//Database
const DB = process.env.DB_CONNECTION_STRING.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error);
	});
