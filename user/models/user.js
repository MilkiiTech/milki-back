const { Sequelize, DataTypes, STRING } = require("sequelize");
const sequelize = require("../../config/db");
const { Sector } = require("./association");
const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    employee_id:{
    type:DataTypes.STRING,
    unique:true,
    allowNull:true
    },
    first_name:{
      type:DataTypes.STRING,
      allowNull:true
    },
    middle_name:{
      type:DataTypes.STRING,
      allowNull:true
    },
    last_name:{
      type:DataTypes.STRING,
      allowNull:true
    },
    username: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: true,
    },
    date_of_birth:{
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender:{
      type:DataTypes.ENUM('MALE','FEMALE'),
      allowNull:true
    },
    marital_status: {
      type: DataTypes.ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.JSONB, // or DataTypes.JSON
      allowNull: true,
      validate: {
        isAddress(value) {
          if (!value.street || !value.city || !value.state || !value.zipCode) {
            throw new Error('Address must include street, city, state, and zip code.');
          }
        },
      },
    },
    valid_identification:{
      type:DataTypes.STRING,
      allowNull:true
    },
    educational_document:{
      type:DataTypes.STRING,
      allowNull:true
    },
    gurantee_document:{
      type:DataTypes.STRING,
      allowNull:true
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
      type:DataTypes.UUID,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.UUID,
      allowNull:true
    },
    sector_id: {
      type: DataTypes.UUID,
      allowNull: true, // Allow sector_id to be null
      references: {
        model: Sector,
        key: 'sector_id',
      },
    }
  });

  module.exports=User;