const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Zone = require('./zone');
const Woreda = require('./woreda');
const Sector = sequelize.define('Sector', {
  sector_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  sector_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number:{
    type:DataTypes.STRING,
    allowNull:true

  },
  email_address:{
    type:DataTypes.STRING,
    allowNull:true

  },
  address:{
    type:DataTypes.STRING,
    allowNull:true
  },
  sector_type: {
    type: DataTypes.ENUM('Zone', 'Woreda'),
    allowNull: false,
  },
  zone_id: {
    type: DataTypes.UUID,
    references: {
      model: Zone,
      key: 'zone_user_id',
    },
    allowNull: true,
  },
  woreda_id: {
    type: DataTypes.UUID,
    references: {
      model: Woreda,
      key: 'woreda_id',
    },
    allowNull: true,
  },
}, {
  tableName: 'sectors',
  timestamps: false,
  validate: {
    onlyOneReference() {
      if ((this.zone_id && this.woreda_id) || (!this.zone_id && !this.woreda_id)) {
        throw new Error('Sector must belong to either a Zone or a Woreda, not both or none.');
      }
    }
  }
});
module.exports = Sector;
