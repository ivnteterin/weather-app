const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(process.env.COOKIE_SECRET)).digest('base64').substr(0, 32);

// Encrypt the cookie value
const encryptCookie = (data) => {
	const iv = crypto.randomBytes(16); // Initialization Vector
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	let encrypted = cipher.update(data, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	const encryptedDataWithIV = iv.toString('hex') + encrypted;
	console.log('encryptedDataWithIV ', encryptedDataWithIV);
	return encryptedDataWithIV;
};

// Decrypt the cookie value
const decryptCookie = (encryptedValue) => {
	console.log('encryptedValue ', encryptedValue);
	const storedIV = Buffer.from(encryptedValue.slice(0, 32), 'hex');
	const storedEncryptedData = encryptedValue.slice(32);

	const decipher = crypto.createDecipheriv(algorithm, key, storedIV);

	let decrypted = decipher.update(storedEncryptedData, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
};

module.exports = { decryptCookie, encryptCookie };
