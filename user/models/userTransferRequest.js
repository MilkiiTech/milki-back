const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const User = require("./user")
const transferRequest = sequelize.define("UserTransferRequest", {
    transfer_request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    current_zone_id: {
      type: DataTypes.UUID,
      allowNull: true,
      
    },
    target_zone_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    target_sector_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending','approved','rejected'),
      allowNull: false,
    },
    requested_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'UserTransferRequests',
    timestamps: true,
  });
module.exports=transferRequest;