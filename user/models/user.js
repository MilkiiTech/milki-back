const { Sequelize, DataTypes } = require("sequelize");
const Role = require('./role');
const sequelize = require("../../config/db");
const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdBy:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.INTEGER,
      allowNull:true
    }
  });

  module.exports=User;