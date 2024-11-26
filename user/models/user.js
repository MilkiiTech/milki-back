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
      type: DataTypes.STRING, // or DataTypes.JSON
      allowNull: true,
      
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
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    suspended_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    suspended_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    password_reset_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  module.exports=User;