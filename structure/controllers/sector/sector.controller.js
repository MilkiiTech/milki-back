const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Zone, Sector, Woreda}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
const { v4: uuidv4 } = require('uuid');
const {PREDEFINED_SECTORS}=require("../../../config/constant");
const {Sequelize, Op}=require("sequelize");
exports.create = async (req, res, next)=>{
    const {sector_name,email_address,phone_number,address}=req.body;
    let {parent_sector_id}=req.body;
    try {
        const user = await User.findByPk(req.user_id, {include:{
          model:Sector,
          as:"sector",
          include:[
            {
              model:Zone
            },
            {
              model:Woreda
            
            }
          ]
       

        }});
      
        let woreda_id;
        let zone_user_id;
        let zone;
        let woreda;
        if (user.sector !=null && user.sector != undefined) {
          if(user?.sector?.woreda_id !=null){
            woreda_id=user?.sector?.woreda_id;
            woreda = await Woreda.findByPk(woreda_id);
          }
          if(user?.sector?.zone_id !=null){
            zone_user_id=user?.sector?.zone_id;
            zone = await Zone.findByPk(zone_user_id);
            parent_sector_id=null;
          }
          
        }

            const sector = await Sector.create({
                sector_name:sector_name,
                sector_type:user?.sector?.sector_type,
                email_address:email_address,
                phone_number:phone_number,
                address:address,
                zone_id:zone_user_id,
                woreda_id:woreda_id,
                parent_sector_id:parent_sector_id
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
            },
            {
                model:Sector,
                as:"ParentSector",
                
            },
            {
                model:Sector,
                as:"SubSectors",
                
            }
        ]});
        return res.status(200).json(sector)
    } catch (error) {
        next(error);
    }
}

exports.findAllOwnSector = async (req, res, next)=>{
    try {
        const sector = await Sector.findAll({
            include: [
              {
                model: Zone,
                required: false,
                where: {
                  userUserId: req.user_id
                }
              },
              {
                model: Woreda,
                required: false,
                where: {
                  userUserId: req.user_id
                }
              },
              {
                model: User,
                as: "createdBy",
                attributes: {
                  exclude: ['password', 'createdAt', 'updatedAt']
                }
              },
              {
                model: User,
                as: "updatedBy",
                attributes: {
                  exclude: ['password', 'createdAt', 'updatedAt']
                }
              },
              {
                model: User,
                as: "users",
                attributes: {
                  exclude: ['password', 'createdAt', 'updatedAt']
                }
              },
              {
                model: Sector,
                as: "ParentSector",
              },
              {
                model: Sector,
                as: "SubSectors",
              }
            ],
            where: {
              [Sequelize.Op.or]: [
                { '$Zone.userUserId$': req.user_id },
                { '$Woreda.userUserId$': req.user_id }
              ]
            }
          });
        return res.status(200).json(sector)
    } catch (error) {
        console.log(error, "Error")
        next(error);
    }
}
// Find One
exports.findOne = async (req, res, next)=>{
    try {
        const {sector_id}=req.params
        const sector = await Sector.findByPk(sector_id,{
            include: [
              {
                model: Zone,
                required: false,
                // where: {
                //   userUserId: req.user_id
                // }
              },
              {
                model: Woreda,
                required: false,
                where: {
                  userUserId: req.user_id
                }
              },
              {
                model: User,
                as: "createdBy",
                attributes: {
                  exclude: ['password', 'createdAt', 'updatedAt']
                }
              },
              {
                model: User,
                as: "updatedBy",
                attributes: {
                  exclude: ['password', 'createdAt', 'updatedAt']
                }
              },
              {
                model: User,
                as: "users",
                attributes: {
                  exclude: ['password', 'createdAt', 'updatedAt']
                }
              },
              {
                model: Sector,
                as: "ParentSector",
              },
              {
                model: Sector,
                as: "SubSectors",
              }
            ],
            where: {
              [Sequelize.Op.or]: [
                { '$Zone.userUserId$': req.user_id },
                { '$Woreda.userUserId$': req.user_id }
              ]
            }
          });
          if (!sector) {
            throw new CustomError(`Sector Not Found With Id: ${sector_id} Not Found`, 404)
          }
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
// get sector name
exports.getSectorName= async (req, res, next)=>{
    return res.status(200).json(PREDEFINED_SECTORS);
}