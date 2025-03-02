const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const MonthlyTask  = sequelize.define("MonthlyTask ", {
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
      workId: {
        type: DataTypes.UUID,
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
  module.exports=MonthlyTask;