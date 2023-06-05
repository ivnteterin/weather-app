const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({ status: err.status, error: err, message: err.message, stack: err.stack });
};

const sendErorrProd = (err, res) => {
	if (err.isOperational) {
		//Errors we controlled
		res.status(err.statusCode).json({ status: err.status, message: err.message });
	} else {
		//Unknown programmig errors not to be leaked to the client
		console.error('ERROR', err);
		res.status(500).json({ status: 'error', message: 'Something went very wrong!' });
	}
};

const errorController = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		sendErorrProd(err, res);
	}
};

module.exports = errorController;
