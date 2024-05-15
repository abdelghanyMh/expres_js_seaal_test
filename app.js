require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const compression = require('compression');
const app = express();

const auth = require('./routes/auth.routes.js');
const admins = require('./routes/admin.routes.js');
const sequelize = require('./config/database');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('assets'));
app.use(compression());

// session setup

app.use(
  session({
    secret: process.env.SESSION_SECRET, // used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

// Testing the connection
try {
  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    auth(app);
    admins(app);
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
app.get('/', (req, res) => {
  res.render('index');
});
module.exports = app;
