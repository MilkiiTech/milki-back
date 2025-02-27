const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const User = require("./user")
const TransferRequest = require("./userTransferRequest")

const TransferLog = sequelize.define("TransferLog", {
    transfer_log_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    transfer_request_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TransferRequest,
        key: 'transfer_request_id'
      }
    },
    user_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references: {
            model: User,
            key: 'user_id'
          }
    },
    old_sector_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references: {
            model: Sector,
            key: 'sector_id'
          }
    },
    new_sector_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references: {
            model: Sector,
            key: 'sector_id'
          }
    },
    time_stamp:{
        type:DataTypes.DATE,
        allowNull:false
    }
})

module.exports = TransferLog;
