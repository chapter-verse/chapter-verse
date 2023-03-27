require('dotenv').config();

require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

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

require('./error-handling')(app);

module.exports = app;
