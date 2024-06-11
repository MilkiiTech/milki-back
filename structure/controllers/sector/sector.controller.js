const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Zone, Sector, Woreda}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
const { v4: uuidv4 } = require('uuid');
exports.create = async (req, res, next)=>{
    const {sector_name, sector_type, zone_user_id, woreda_id}=req.body
    try {
        const user = await User.findByPk(req.user_id);
        let zone;
        let woreda;
        if (zone_user_id !=null) {
            zone = await Zone.findByPk(zone_user_id);
        }
        if (woreda_id != null) {
            woreda = await Woreda.findByPk(woreda_id);
        }

            const sector = await Sector.create({
                sector_name:sector_name,
                sector_type:sector_type,
                zone_id:zone_user_id,
                woreda_id:woreda_id
            })
            await sector.setCreatedBy(user);
            await sector.setZone(zone);
            await sector.setWoreda(woreda);
            return res.status(201).json(sector);
    
       
        
    } catch (error) {
        console.log(error);
       next(error); 
    }
}
// Find All Zones 
exports.findAll = async (req, res, next)=>{
    try {
        const sector = await Sector.findAll({include:[
            {
                model:Zone,
                
            },
            {
                model:Woreda
            },
            {
                model:User,
                as:"createdBy",
                attributes:{
                    exclude:[
                        'password','createdAt','updatedAt'
                    ]
                }
            },
            {
                model:User,
                as:"updatedBy",
                attributes:{
                    exclude:[
                        'password','createdAt','updatedAt'
                    ]
                }
            },
            {
                model:User,
                as:"users",
                attributes:{
                    exclude:[
                        'password','createdAt','updatedAt'
                    ]
                }
            }
        ]});
        return res.status(200).json(sector)
    } catch (error) {
        next(error);
    }
}
// Find One
exports.findOne = async (req, res, next)=>{
    try {
        const {sector_id}=req.params
        const sector = await Sector.findByPk(sector_id,{include:[
            {
                model:Zone
            },
            {
                model:Woreda
            },
            {
                model:User,
                as:"createdBy",
                attributes:{
                    exclude:[
                        'password','createdAt','updatedAt'
                    ]
                }
            },
            {
                model:User,
                as:"updatedBy",
                attributes:{
                    exclude:[
                        'password','createdAt','updatedAt'
                    ]
                }
            },
            {
                model:User,
                as:"users",
                attributes:{
                    exclude:[
                        'password','createdAt','updatedAt'
                    ]
                }
            }
        ]});
        return res.status(200).json(sector)
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