const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const WeeklyTasks  = sequelize.define("WeeklyTasks ", {
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
        type: DataTypes.TEXT,
        allowNull: true,
    },
    monthlyTaskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'MonthlyTasks', // References the MonthlyTasks table
            key: 'id',
        },
    },
    week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 52,
        },
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // References the Users table
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending',
    },
    workId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Works', // References the Works table
            key: 'id',
        },
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 12,
        },
    },
    year: {
        type: DataTypes.INTEGER,
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
  module.exports=WeeklyTasks;