const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.use(compression());

// Testing the connection

const sequelize = require('./config/database');
testDbConnection();

app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;

async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
