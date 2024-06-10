const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Woreda = sequelize.define("Woreda", {
    woreda_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    woreda_name: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: true,
    },
    city_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
      }
  });

  module.exports=Woreda;