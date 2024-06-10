const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const UsersRole = sequelize.define("UsersRoles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  });
  module.exports=UsersRole;