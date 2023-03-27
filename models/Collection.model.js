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
		books:{
			type: [String],
			required: false,
		}
	},
	{
		timestamps: true,
	},
);

const Collection = model('Collection', collectionSchema);

module.exports = Collection;
