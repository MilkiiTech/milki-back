const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Work,WeeklyTask}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
const { v4: uuidv4 } = require('uuid');

exports.create = async (req, res, next)=>{
    // const {username, email, phone_number, password}=req.body;
    const {description, plannedStartDate,plannedEndDate,quality,quantity,timeRequired,cost}=req.body;
    try { 
        const result = await sequelize.transaction(async(t)=>{
            console.log(req.user_id);
            const currentUser = await User.findByPk(req.user_id);
            console.log(currentUser, "Fetched User");
            const work = await Work.create({
                description,
                plannedStartDate,
                plannedEndDate,
                quality,
                quantity,
                timeRequired,
                cost
            },{transaction:t})
            await work.setCreatedBy(currentUser, {transaction:t});
            
           
        return res.status(201).json(work);
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
// Find All Zones 
exports.findAll = async (req, res, next)=>{
    try {
        const work = await Work.findAll({where:{
            
        }},{include:{
            model:User,
            as:"user",
            
        }});
        return res.status(200).json(work)
    } catch (error) {
        next(error);
    }
}
// Find One
exports.findOne = async (req, res, next)=>{
    try {
        const {workId}=req.params
        const work = await Work.findByPk(workId,{include:[
            
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
        return res.status(200).json(work)
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
exports.deleteOne = async (req, res,next)=>{
    const {zone_user_id}=req.params;
    try {
        const zoneUser = await Zone.findByPk(zone_user_id);
        await zoneUser.destroy();
        return res.status(200).json(zoneUser);
    } catch (error) {
        next(error)
    }
}