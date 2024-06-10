const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const User = require("./user")
const Role = sequelize.define("Role", {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false,
    },
  });
module.exports=Role;