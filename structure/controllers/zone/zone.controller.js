const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Zone}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
const { v4: uuidv4 } = require('uuid');
exports.create = async (req, res, next)=>{
    // const {username, email, phone_number, password}=req.body;
    const {userDetail, zoneDetail, role_id}=req.body;
    const {username, email, phone_number}=userDetail;
    const {zone_name, city_name, contact_phone_number,email_address}=zoneDetail;
    let transaction;
    try {
        let password = generatePassword();
        console.log(password, "password");
        const hashed_password=await bcrypt.hash(password.toString(), 10);
        const result = await sequelize.transaction(async(t)=>{
            const user = await User.create({
                username,
                email,
                password:hashed_password,
                phone_number,
                createdBy:req.user_id
            }, {transaction:t})
            const zone = await Zone.create({
            
                zone_name,
                city_name,
                phone_number:contact_phone_number,
                email_address,
                createdBy:req.user_id
            },{transaction:t})
            // await user.addZone(zone);
            await zone.setUser(user,{ transaction: t });
            if (role_id) {
                const role = await Role.findByPk(role_id,{transaction:t});
                if(role == null){
                    t.rollback();
                    throw new CustomError("Bad Request Role is Mandatory", 400);
                }
                await user.addRole(role, {transaction:t});
                
            }
        return res.status(201).json(user);


        })
    } catch (error) {
        next(error)
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