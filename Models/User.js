const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require("bcrypt");

class User extends Model {
   // добавляем метод comparePassword для сравнения паролей
   async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
    role: {
      type: DataTypes.ENUM('customer', 'user', 'admin'),
      defaultValue: 'user',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

User.prototype.generateAccessToken = (id, email) => {
  const payload = {
      userId: id,
      email: email
  }
  return jwt.sign(payload, 'Hello', {expiresIn: "1h"})
}

module.exports = User;