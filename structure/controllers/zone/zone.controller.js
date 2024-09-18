const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Zone,Sector}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
const { v4: uuidv4 } = require('uuid');

exports.create = async (req, res, next)=>{
    // const {username, email, phone_number, password}=req.body;
    const {users, zoneDetail}=req.body;
    const {zone_name, city_name, contact_phone_number,email_address, address}=zoneDetail;
    try {
        let password = generatePassword();
       console.log(password, "password");
        
        const hashed_password=await bcrypt.hash(password.toString(), 10);
        const refinedUsers = users.map(user => {
            const { username, email, phone_number } = user;
            return { username, email, phone_number, password:hashed_password };
        });
        
        const result = await sequelize.transaction(async(t)=>{
            const currentUser = await User.findByPk(req.user_id);
            const user = await User.bulkCreate(refinedUsers, {transaction:t});
            const role1 = await Role.findByPk(users[0].role_id,{transaction:t});
            const role2 = await Role.findByPk(users[1].role_id,{transaction:t});
            await user[0].addRole(role1, {transaction:t});
            await user[1].addRole(role2, {transaction:t});
            const zone = await Zone.create({
                zone_name,
                city_name,
                phone_number:contact_phone_number,
                email_address,
                address,
                createdById:req.user_id
            },{transaction:t});
            const new_sectors=users.map(sector => {
                const { sector_name,sector_phone_number,sector_email_address,sector_address} = sector;
                const { zone_user_id} = zone;
                return { sector_name, sector_type:"Zone",phone_number:sector_phone_number, email_address:sector_email_address,address:sector_address,zone_id:zone_user_id };
            });
            const sector = await Sector.bulkCreate(new_sectors,{transaction:t})
            await sector[0].setCreatedBy(currentUser, {transaction:t});
            await sector[1].setCreatedBy(currentUser, {transaction:t});
            await sector[0].setZone(zone, {transaction:t});
            await sector[1].setZone(zone, {transaction:t});
            // await zone.setUser(user[0],{ transaction: t });
            // await zone.setUser(user[1],{ transaction: t });
           // Add multiple users to the sector at once
           await sector[0].setUsers([user[0], user[1]], { transaction: t });
           await sector[1].setUsers([user[0], user[1]], { transaction: t });
        return res.status(201).json(zone);
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
// Find All Zones 
exports.findAll = async (req, res, next)=>{
    try {
        const currentUser = await User.findByPk(req.user_id, {
            include:{
            model:Sector,
            as:"sector",
            include:[
                {
                    model:Zone,
                    
                }
            ],
            
          }});
        const zone = await Zone.findAll({where:{
            zone_user_id:currentUser?.sector?.Zone.zone_user_id
        }, include:[
            // {
            //     model:User,
            //     as:"user",
            //     attributes:{
            //         exclude:['password']
            //     }
                
                
            // },
            {
                model:User,
                as:"createdBy",
                attributes:{
                    exclude:['password']
                }
            },
            {
                model:User,
                as:"updatedBy",
                attributes:{
                    exclude:['password']
                }
            },

        {
            model:Sector
        }

        ]});
        return res.status(200).json(zone)
    } catch (error) {
        console.log(error, "Error");
        next(error);
    }
}
// Find One
exports.findOne = async (req, res, next)=>{
    try {
        const {zone_user_id}=req.params
        const zone = await Zone.findByPk(zone_user_id,{include:[
            // {
            //     model:User,
            //     as:"user",
            //     attributes:{
            //         exclude:['password']
            //     }
                
            // },
            {
                model:User,
                as:"createdBy",
                attributes:{
                    exclude:['password']
                }
            },
            {
                model:User,
                as:"updatedBy",
                attributes:{
                    exclude:['password']
                }
            },
            {
                model:Sector
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