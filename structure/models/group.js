const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Group = sequelize.define("groups", {
    group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_name: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: true,
    },
  });

  module.exports=Group;