const { Schema, model } = require('mongoose');

const collectionSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: false,
		},
		books: {
			type: [String],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageUrl: {
			type: String,
			default: 'https://res.cloudinary.com/dsbfbwbvq/image/upload/v1680046581/Chapter-Verse/dggnf8eabz4hw6hpc8ur.png'
		}
	},
	{
		timestamps: true,
	},
);

const Collection = model('Collection', collectionSchema);

module.exports = Collection;
