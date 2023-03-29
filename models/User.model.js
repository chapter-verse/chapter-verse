const { Schema, model } = require('mongoose');
const { isEmail, isEmpty, isLength } = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			trim: true,
			required: [true, 'Please enter a Username'],
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			required: [true, 'Please enter an Email'],
			validate: [isEmail, 'Please enter a valid Email'],
		},
		password: {
			type: String,
			required: [true, 'Please enter a Password'],
			minlength: [3, 'Password must have at least 3 characters.'],
		},
		birthday: {
			type: String,
			required: false,
		},
		description: {
			type: String,
			required: false,
		},
		collections: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Collection',
			},
		],
		imageUrl: {
			type: String,
			default: 'https://res.cloudinary.com/dsbfbwbvq/image/upload/v1680051413/Chapter-Verse/Avatar_01_scbhma.jpg'
		}
	},
	{
		timestamps: true,
	},
);

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		if (!isLength(this.password, { min: 3 })) {
			return next(new Error('Password must have at least 3 characters.'));
		}
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(this.password, salt);
		this.password = hash;
	}
	next();
});

const User = model('User', userSchema);

module.exports = User;
