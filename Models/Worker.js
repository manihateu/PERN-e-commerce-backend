const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Order = require('./Order');

const Worker = sequelize.define('Worker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('customer', 'user', 'admin', 'worker'),
    defaultValue: 'worker',
  },
});

// Связь работника с заказами (один ко многим)
Worker.hasMany(Order, { foreignKey: 'workerId' });
Order.belongsTo(Worker, { foreignKey: 'workerId' });

module.exports = Worker;