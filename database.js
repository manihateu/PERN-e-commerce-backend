const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('SHOP', 'postgres', 'nik852', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;