const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const User = require("./user")
const TransferRequest = require("./userTransferRequest")

const TransferLog = sequelize.define("TransferLog", {
    transfer_log_id: {
      type: DataTypes.UUID,
      primaryKey: true,
defaultValue:Sequelize.UUIDV4,    },
    transfer_request_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    user_id:{
        type:DataTypes.UUID,
        allowNull:true,
        
    },
    old_sector_id:{
        type:DataTypes.UUID,
        allowNull:true,
       
    },
    new_sector_id:{
        type:DataTypes.UUID,
        allowNull:true,
        
    },
    timestamp:{
        type:DataTypes.DATE,
        allowNull:true
    }
})

module.exports = TransferLog;
