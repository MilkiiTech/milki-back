const { Pool } = require('pg');
const config = require('./config');
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
    host: config.get('db.host'),
    port: config.get('db.port'),
    database: config.get('db.name'),
    username: config.get('db.user'),
    password: config.get('db.password'),
    dialect: "postgres",
    
  });
  // Test the database connection
  async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
    } catch (error) {
      console.error("Error connecting");
    }
  }
//   sequelize.sync({ alter: true}).then(()=>{
//   console.log('Database synchronized successfully.');
// }).catch((error)=>{
//   console.error('Error synchronizing database:', error);
// })
  testConnection();
  module.exports = sequelize;
