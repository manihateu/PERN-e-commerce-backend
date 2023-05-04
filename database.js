const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("verceldb", "default", "YrDqmevGB2X7", {
  host: "ep-lively-snowflake-301340-pooler.eu-central-1.postgres.vercel-storage.com",
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

module.exports = sequelize;