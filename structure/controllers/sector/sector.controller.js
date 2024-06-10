const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Zone, Sector}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
const { v4: uuidv4 } = require('uuid');
exports.create = async (req, res, next)=>{
    const {sector_name, sector_type, zone_user_id, woreda_id}=req.body
    try {
        const sector = await Sector.create({
           sector_name:sector_name,
            sector_type:sector_type,
            zone_id:zone_user_id,
            woreda_id:woreda_id
        })
        
    } catch (error) {
        
    }
}
// Find All Zones 
exports.findAll = async (req, res, next)=>{
    try {
        const zone = await Zone.findAll({include:{
            model:User,
            as:"user",
            
        }});
        return res.status(200).json(zone)
    } catch (error) {
        next(error);
    }
}
// Find One
exports.findOne = async (req, res, next)=>{
    try {
        const {zone_user_id}=req.params
        const zone = await Zone.findByPk(zone_user_id,{include:[
            {
                model:User,
                as:"user",
                
            },
            {
                model:User,
                as:"createdBy"
            },
            {
                model:User,
                as:"updatedBy"
            }
        ], attributes:{
            exclude:['updatedByUserId', 'createdByUserId']
        }});
        return res.status(200).json(zone)
    } catch (error) {
        next(error);
    }
}
// update zone 
exports.update = async (req, res,next)=>{
    const {zone_name, phone_number, email_address, city_name}=req.body;
    const {zone_user_id}=req.params;
    try {
        const zoneUser = await Zone.findByPk(zone_user_id);
        await zoneUser.update({
            zone_name:zone_name, phone_number:phone_number, email_address:email_address, city_name:city_name
        })
        return res.status(200).json(zoneUser);
    } catch (error) {
        next(error)
    }
}
// delete zone
exports.delete = async (req, res,next)=>{
    const {zone_user_id}=req.params;
    try {
        const zoneUser = await Zone.findByPk(zone_user_id);
        await zoneUser.destroy();
        return res.status(200).json(zoneUser);
    } catch (error) {
        next(error)
    }
}