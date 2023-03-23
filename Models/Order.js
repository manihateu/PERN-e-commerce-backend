const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Product = require('./Product');
const Worker = require('./Worker');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('new', 'in progress', 'completed'),
    defaultValue: 'new',
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Связь заказа с пользователем (многие ко одному)
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

// Связь заказа с продуктами (многие ко многим)
const ProductOrder = sequelize.define('ProductOrder', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});
Order.belongsToMany(Product, { through: ProductOrder });
Product.belongsToMany(Order, { through: ProductOrder });

// Связь заказа с работником (многие ко одному)
Order.belongsTo(Worker, { foreignKey: 'workerId' });
Worker.hasMany(Order, { foreignKey: 'workerId' });

module.exports = Order;