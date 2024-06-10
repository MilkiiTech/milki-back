const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const RolePermission = sequelize.define("rolePermission", {    
  });
  module.exports=RolePermission;