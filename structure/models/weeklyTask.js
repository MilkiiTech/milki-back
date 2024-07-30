const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const WeeklyTask  = sequelize.define("WeeklyTask ", {
  weekly_task_id: {
    type: DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      taskStatus:{
        type: DataTypes.ENUM,
        values: [ 'UNASSIGNED','ASSIGNED','TODO', 'INPROGRESS', 'DONE', 'OTHER'],
        allowNull: true,
        defaultValue:'UNASSIGNED'
      },
      workId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      weekNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sectorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pickedBy: {
        type: DataTypes.UUID,
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