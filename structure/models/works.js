const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Works = sequelize.define("works", {
  id: {
    type: DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'unassigned',
  },
  zone_id: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      model: 'Zone',
      key: 'id',
    },
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
  progress: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0, // Progress in percentage (0-100)
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
module.exports=Works;