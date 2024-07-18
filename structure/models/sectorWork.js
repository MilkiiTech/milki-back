const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Work = require("./work");
const Sector=require("./sector");
const SectorWork = sequelize.define("sectorWork", {
    workId: {
        type: DataTypes.UUID,
        references: {
          model: Work,
          key: 'workId',
        },
      },
      sectorId: {
        type: DataTypes.UUID,
        references: {
          model: Sector,
          key: 'sector_id',
        },
      },   
  });
  module.exports=SectorWork;