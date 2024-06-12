const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Zone, Sector, Woreda, Group}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
const { v4: uuidv4 } = require('uuid');
exports.create = async (req, res, next)=>{
    const {group_name, leader_id, members_id, sector_id}=req.body;
    try {
        const sector = await Sector.findOne({
            where:{
                sector_id:sector_id,
            },include:{
                model:User,
                as:"users",
                where:{
                   user_id:leader_id 
                }
                
            }
        })
        console.log(sector, "sector")
        const user = await User.findByPk(req.user_id);
        if(! sector){
            throw new CustomError(`Sector with Id: ${sector_id} Not Found`)
        }
        
        const group = await Group.create({group_name})
        // await group.addCreatedByUser(user);
        await group.setLeader(sector?.users[0]);
        if (members_id?.length >=1) {
            const members = await User.findAll({ where: { user_id: members_id,sector_id:sector.sector_id } });
            if (members) {
                await group.setMembers(members);
            }
        }
        if (user) {
        await group.setCreatedBy(user);
            
        }
        await group.setSector(sector);
        return res.status(201).json(group);

    } catch (error) {
        next(error)
    }
}
// Find All Zones 
exports.findAll = async (req, res, next)=>{
    try {
        const group = await Group.findAll({include:[
            {
                model:User,
                as:"leader",
                attributes:[
                    'username','phone_number', 'email'
                ]
            },
            {
                model:User,
                as:"members",
                attributes:[
                    'username','phone_number', 'email'
                ]
            },
            {
                model:Sector,
                as:"sector"
            }
        ]})
        return res.status(200).json(group)
    } catch (error) {
        next(error);
    }
}
// Find One
exports.findOne = async (req, res, next)=>{
    try {
        const {group_id}=req.params
        const group = await Group.findByPk(group_id,{include:[
            {
                model:User,
                as:"leader",
                attributes:[
                    'username','phone_number', 'email'
                ]
            },
            {
                model:User,
                as:"members",
                attributes:[
                    'username','phone_number', 'email'
                ]
            },
            {
                model:Sector,
                as:"sector"
            }
        ]})
        return res.status(200).json(group)
    } catch (error) {
        next(error);
    }
}
// update zone 
exports.update = async (req, res,next)=>{
    const {sector_name, sector_type}=req.body
    const {sector_id}=req.params
    const {zone_user_id}=req.params;
    try {
        const sector = await Sector.findByPk(sector_id);
        await sector.update({
            sector_name:sector_name, sector_type:sector_type
        })
        return res.status(200).json(sector);
    } catch (error) {
        next(error)
    }
}
// delete zone
exports.deleteOne = async (req, res,next)=>{
    const {sector_id}=req.params;
    try {
        const sector = await Sector.findByPk(sector_id);
        await sector.destroy();
        return res.status(200).json(sector);
    } catch (error) {
        next(error)
    }
}