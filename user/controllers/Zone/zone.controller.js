const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, ZoneUser, Role}= require("../../models/association")
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
        transaction=sequelize.transaction();
        const user = await User.create({
           
            username,
            email,
            password:hashed_password,
            phone_number
        },{transaction})
        
        const zone = await ZoneUser.create({
            
            zone_name,
            city_name,
            phone_number:contact_phone_number,
            email_address
        },{transaction})
        if (role_id) {
            const role = await Role.findByPk(role_id,{transaction});
            await user.addRole(role, {transaction});
        }
        // commit the transaction that need to be created
        await transaction.commit();
        return res.status(201).json(user);
    } catch (error) {
        console.log(error, "error");
        if (transaction) await transaction.rollback();
        next(error)
    }
    

}
// Find All Zones 
exports.findAll = async (req, res, next)=>{
    try {
        const zoneUser = await ZoneUser.findAll({include:{
            model:User,
            as:"user"
        }});
    } catch (error) {
        next(error);
    }
}

exports.update = async (req, res,next)=>{
    const {zone_name, phone_number, email_address, city_name}=req.body;
    const {zone_user_id}=req.params;
    try {
        const zoneUser = await ZoneUser.findByPk(zone_user_id);
        await zoneUser.update({
            zone_name:zone_name, phone_number:phone_number, email_address:email_address, city_name:city_name
        })
        return res.status(200).json(zoneUser);
    } catch (error) {
        next(error)
    }
}

exports.delete = async (req, res,next)=>{
    const {zone_user_id}=req.params;
    try {
        const zoneUser = await ZoneUser.findByPk(zone_user_id);
        await zoneUser.destroy();
        return res.status(200).json(zoneUser);
    } catch (error) {
        next(error)
    }
}