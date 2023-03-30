require('dotenv').config();

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials/");

require('./config/session-config')(app);
require('./config')(app);

const capitalize = require('./utils/capitalize');
const projectName = 'Chapter Verse';

app.locals.appTitle = `${capitalize(projectName)}`;

app.use('/', require('./routes/index'));

app.use('/login', require('./routes/login'));

app.use('/register', require('./routes/register'));

app.use('/profile', require('./routes/profile'));

app.use('/logout', require('./routes/logout'));

app.use('/books', require('./routes/books'));

app.use('/collections', require('./routes/collections'));

require('./error-handling')(app);

module.exports = app;
