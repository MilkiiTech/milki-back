const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const WeeklyTask  = sequelize.define("WeeklyTask ", {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'unassigned', // Weekly task starts as unassigned
      },
      workId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      weekNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sectorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pickedBy: {
        type: Sequelize.INTEGER,
        allowNull: true, // Nullable until a user picks it
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

  module.exports=WeeklyTask;