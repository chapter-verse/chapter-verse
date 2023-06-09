const express = require('express');

const logger = require('morgan');

const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const favicon = require('serve-favicon');

const path = require('path');

const session = require('express-session');

const MongoStore = require('connect-mongo');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chapter-verse';

module.exports = (app) => {
	app.use(logger('dev'));

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(cookieParser());

	app.set('views', path.join(__dirname, '..', 'views'));

	app.set('view engine', 'hbs');

	app.use(express.static(path.join(__dirname, '..', 'public')));

	app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')));

	app.use(
		session({
			secret: process.env.SECRET || 'The Secret Code of Doom',
			resave: false,
			saveUninitialized: false,
			store: MongoStore.create({
				mongoUrl: MONGO_URI,
			}),
		}),
	);
};
