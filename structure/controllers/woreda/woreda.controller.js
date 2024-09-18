const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Zone,Woreda, Sector}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
exports.create = async (req, res, next)=>{ 
    const {users, woredaDetail}=req.body; 
    const {woreda_name, city_name, contact_phone_number,email_address}=woredaDetail;
    try {
        let password = generatePassword();
        const hashed_password=await bcrypt.hash(password.toString(), 10);
        const refinedUsers = users.map(user => {
            const { username, email, phone_number } = user;
            return { username, email, phone_number, password:hashed_password };
        }); 
        const result = await sequelize.transaction(async(t)=>{
            // const zone = await Zone.findByPk(zone_id);
            const currentUser = await User.findByPk(req.user_id, {include:{
                model:Sector,
                as:"sector",
                include:[
                    {
                        model:Zone,
                        
                    },
                    {
                        model:Woreda,
                        include:{
                            model:Zone,
                            as:'zone'
                        }
                    }
                ],
                
              }});
            let zone_user_id;
            let zone=null;
            let zone_sector=false;
            if (currentUser?.sector?.sector_type === 'Zone') {
                zone_user_id = currentUser?.sector?.zone_id;
                zone=currentUser?.sector?.Zone
                zone_sector=true;
                
            }
            const role1 = await Role.findByPk(users[0].role_id,{transaction:t});
            const role2 = await Role.findByPk(users[1].role_id,{transaction:t});
            const user = await User.bulkCreate(refinedUsers, {transaction:t});
            await user[0].addRole(role1, {transaction:t});
            await user[1].addRole(role2, {transaction:t});
            const woreda = await Woreda.create({
                woreda_name,
                city_name,
                phone_number:contact_phone_number,
                email_address,
                
            },{transaction:t})
            await woreda.setZone(zone, {transaction:t});
            await woreda.setCreatedBy(currentUser, {transaction:t});
            const new_sectors=users.map(sector => {
                const { sector_name,sector_phone_number,sector_email_address,sector_address} = sector;
                return { sector_name, sector_type:"Woreda", phone_number:sector_phone_number, email_address:sector_email_address,address:sector_address, woreda_id:woreda.woreda_id };
            });
            console.log("creating the following sectors", new_sectors)
            const sector = await Sector.bulkCreate(new_sectors,{transaction:t})
            await sector[0].setCreatedBy(currentUser, {transaction:t});
            await sector[1].setCreatedBy(currentUser, {transaction:t});
                   // Add Sector to  
            console.log("This is Woreda Sector........................................");
            await sector[0].setWoreda(woreda, {transaction:t});
            await sector[1].setWoreda(woreda, {transaction:t});
            // if (zone_sector === true) {
            //     console.log("This is Zonne Sector....................................................");
            //     await sector[0].setZone(zone, {transaction:t});
            //     await sector[1].setZone(zone, {transaction:t});
            // }
            // if (woreda_sector === true) {
            //      // Add Sector to  
            //      console.log("This is Woreda Sector........................................");
            // await sector[0].setWoreda(users_woreda, {transaction:t});
            // await sector[1].setWoreda(users_woreda, {transaction:t});
            // }
            // Add multiple users to the sector at once
            await sector[0].setUsers([user[0], user[1]], { transaction: t });
            await sector[1].setUsers([user[0], user[1]], { transaction: t });
            
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
        const currentUser = await User.findByPk(req.user_id, {
            include:{
            model:Sector,
            as:"sector",
            include:[
                {
                    model:Zone,
                    
                },
                {
                    model:Woreda,
                    include:{
                        model:Zone,
                        as:'zone'
                    }
                }
            ],
            
          }});
          console.log(currentUser.sector.Woreda, "Current Users Woreda");
          console.log(currentUser.sector.Zone, "Current Users Sector");
          let woreda;
          if (currentUser?.sector?.Woreda?.woreda_id !=null) {
            woreda = await Woreda.findAll({
                where:{
                    woreda_id:currentUser?.sector?.Woreda?.woreda_id

                },
                include:[
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
          }
          if (currentUser?.sector?.Zone?.zone_user_id) {
            woreda = await Woreda.findAll({
                include:[
                {   model:User,
                    as:"user",
                    attributes:{
                        exclude:['password','createdAt', 'updatedAt']
                    }
                },{
                    model:Zone,
                    as:"zone",
                    where:{
                        zone_user_id:currentUser?.sector?.Zone?.zone_user_id
                    }
                }
            ]});
          }
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
