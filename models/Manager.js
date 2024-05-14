const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manger = sequelize.define('Manger', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  occurrence: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

module.exports = Manger;
