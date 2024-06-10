const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Zone,Woreda}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
exports.create = async (req, res, next)=>{
    // const {username, email, phone_number, password}=req.body;
    const {userDetail, woredaDetail, role_id, zone_id}=req.body;
    const {username, email, phone_number}=userDetail;
    const {woreda_name, city_name, contact_phone_number,email_address}=woredaDetail;
    try {
        let password = generatePassword();
        console.log(password, "password");
        console.log(zone_id, "zone_id");
        const hashed_password=await bcrypt.hash(password.toString(), 10);
        const result = await sequelize.transaction(async(t)=>{
            const zone = await Zone.findByPk(zone_id);
            const currentUser = await User.findByPk(req.user_id)
            if (zone==null) {
                t.rollback();
                throw new CustomError(`Bad Request Zone is Not Found With Id: ${zone_id}`, 400);
            }
            const user = await User.create({
                username,
                email,
                password:hashed_password,
                phone_number,
            }, {transaction:t})
            const woreda = await Woreda.create({
                woreda_name,
                city_name,
                phone_number:contact_phone_number,
                email_address,
                
            },{transaction:t})
            // await user.addZone(zone);
            await woreda.setUser(user,{ transaction: t });
            await woreda.setZone(zone, {transaction:t});
            await woreda.setCreatedBy(currentUser, {transaction:t});
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
        console.log(error, "Error");
        next(error)
    }
    

}
exports.findOne = async (req, res, next)=>{
    try {
        const {woreda_id}=req.params
        const woreda = await Woreda.findByPk(woreda_id,{include:[
            {   model:User,
                as:"user",
                attributes:{
                    exclude:['password','createdAt', 'updatedAt']
                }
            },{
                model:Zone,
                as:"zone"
            }
        ]});
        return res.status(200).json(woreda)
    } catch (error) {
        next(error);
    }
}
// Find All Zones 
exports.findAll = async (req, res, next)=>{
    try {
        const woreda = await Woreda.findAll({include:[
            {   model:User,
                as:"user",
                attributes:{
                    exclude:['password','createdAt', 'updatedAt']
                }
            },{
                model:Zone,
                as:"zone"
            }
        ]});
        return res.status(200).json(woreda)
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
    const {woreda_id}=req.params;
    try {
        const woreda = await Woreda.findByPk(woreda_id);
        await woreda.destroy();
        return res.status(200).json(woreda);
    } catch (error) {
        next(error)
    }
}
