const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Permission = sequelize.define("permission", {
    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    permission_name: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false,
    },
  });

//   Role.belongsTo(User, {as:"leader"});
//   Role.belongsTo(User, {as:"createdBy"});
//   Group.belongsTo(User, {as:"updatedBy"});
//   Group.belongsToMany(User, { through: 'GroupMembers', as: 'members' });

  module.exports=Permission;