const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Work = sequelize.define("Work", {
  workId: {
    type: DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'unassigned',
  },
  assignedBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  sectorId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  pickedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  plannedStartDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  plannedEndDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  quality: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  timeRequired: {
    type: Sequelize.INTEGER,
    allowNull: false, // Time required in hours
  },
  cost: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});
module.exports=Work;