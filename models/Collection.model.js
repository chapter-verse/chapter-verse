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
			required: false,
			unique: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Collection = model('Collection', collectionSchema);

module.exports = Collection;
