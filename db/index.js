const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Chapter-Verse';

mongoose
	.connect(MONGO_URI)
	.then((x) => {
		const databaseName = x.connections[0].name;
		console.log(`Connected to Database`);
	})
	.catch((err) => {
		console.error('Error connecting to Database: ', err);
	});
