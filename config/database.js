// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('seaal_test', 'root', 'toor', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
