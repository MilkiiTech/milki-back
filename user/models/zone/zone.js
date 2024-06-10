const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const Zone = sequelize.define("Zone", {
    zone_user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    zone_name: {
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

  module.exports=Zone;