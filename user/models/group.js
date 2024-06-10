const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const User = require("./user")
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

  Group.belongsTo(User, {as:"leader"});
  Group.belongsTo(User, {as:"createdBy"});
  Group.belongsTo(User, {as:"updatedBy"});
  Group.belongsToMany(User, { through: 'GroupMembers', as: 'members' });

  module.exports=Group;