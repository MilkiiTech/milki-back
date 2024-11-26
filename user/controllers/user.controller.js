const CustomError = require("../../error/customError");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require('../../config/config');
const {Role, User, Sector, Group, Zone, Woreda, TransferRequest}=require("../models/association")
const Permission = require("../models/permission");
const {generatePassword}= require("../../utils/utils")
const {Op}=require("sequelize");
const sequelize = require("../../config/db");
const crypto = require('crypto');
const { sendEmail } = require('../../utils/email'); // You'll need to implement this

// user signup controller 
exports.registerUser = async (req, res, next)=>{
    const {username, email, phone_number, password}=req.body;
    try {
        const hashed_password=await bcrypt.hash(password, 10);
        console.log(hashed_password)
        const user = await User.create({
            username,
            email,
            password:hashed_password,
            phone_number
        })
        return res.status(201).json(user);
    } catch (error) {
        
        next(error)
    }
    

}
// user signin controller
exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({
            where: { username },
            include: { model: Role }
        });

        if (!user) {
            throw new CustomError("Invalid Credentials", 401);
        }

        // Check if user is suspended
        if (!user.is_active) {
            throw new CustomError("Your account has been suspended. Please contact administrator.", 403);
        }

        // Use promisified bcrypt compare
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            throw new CustomError("Invalid Credentials", 401);
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Generate token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.Roles?.map((r) => r.role_name)
            },
            config.get('jwt.secret'),
            { expiresIn: "24h" }
        );

        req.session.jwt = token;
        return res.status(200).json({ 
            status: 'success',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                roles: user.Roles?.map((r) => r.role_name)
            }
        });

    } catch (error) {
        next(error);
    }
};




// create New Group/Team
exports.createGroup = async (req, res, next)=>{
    const {group_name, leader_id, members_id}=req.body;
    try {
        const user = await User.findByPk(leader_id);
        if (!user) {
            throw new CustomError("User Not Found", 400)
        }
        const group = await Group.create({group_name})
        // await group.addCreatedByUser(user);
        await group.setLeader(user);
        if (members_id?.length >=1) {
            const members = await User.findAll({ where: { user_id: members_id } });
            await group.setMembers(members);

             
        }
        await group.setCreatedBy(user);
        return res.status(201).json(group);

    } catch (error) {
        next(error)
    }

}
// assign Memebers to the group
exports.assignMembersToGroup = async (req, res,  next)=>{
    try {
        const {members_id}=req.body;
        const {group_id}=req.params;
        
        const group = await Group.findByPk(group_id);
        
        if (!group) {
            throw new CustomError(`Group With that id is not found: ${group_id}`, 404)
        }
        if (group.leader_id != req.user_id && req.role != "SUPER_ADMIN") {
            throw new CustomError(`You Cannot set Members to group that you do not belongs`, 400)
        }
        
        const members = await User.findAll({where:{user_id:{
            [Op.in]:members_id
        }}});
        await group.setMembers(members);
        return res.status(200).json(group);
    } catch (error) {
        
        next(error)
    }
}
// Get All Groups
exports.findAll = async (req, res, next)=>{
    try {
        const group = await Group.findAll({include:[
            {
                model:User,
                as:"leader",
                attributes:[
                    'username','phone_number', 'email', 'role'
                ]
            },
            {
                model:User,
                as:"members",
                attributes:[
                    'username','phone_number', 'email', 'role'
                ]
            }
        ]})
        return res.status(200).json(group);
    } catch (error) {
        
    }
}
// get One Role by role id
exports.findOne = async (req, res, next)=>{
    const {group_id}=req.query;
    try {
        const group = await Group.findByPk(group_id,{include:[
            {
                model:User,
                as:"leader",
                attributes:[
                    'username','phone_number', 'email', 'role'
                ]
            },
            {
                model:User,
                as:"members",
                attributes:[
                    'username','phone_number', 'email', 'role'
                ]
            }
        ]})
        return res.status(200).json(group);
    } catch (error) {
        
    }
}
// get All Roles 
exports.findAllRole = async (req, res, next)=>{
    try {
        const role = await Role.findAll({include:[
            {
                model:Permission,
                as:"permissions",
               
            }
        ]})
        return res.status(200).json(role);
    } catch (error) {
        next(error)
    }
}
// Get All Permissions
exports.findAllPermission = async (req, res, next)=>{
    try {
        const permission = await Permission.findAll({});
        return res.status(200).json(permission);
    } catch (error) {
        next(error)
    }
}
// assign Permission to Roles
exports.assignRolePermission = async (req, res,  next)=>{
    try {
        const {role_id, permission_ids}=req.body;
        console.log(permission_ids);
        const role = await Role.findByPk(role_id);
        const permissions = await Permission.findAll({where:{permission_id:{
            [Op.in]:permission_ids
        }}});
        if (! role || ! permissions) {
            throw new CustomError("Permission or Role does not found", 404)
        }
        
        await role.addPermissions(permissions);
        return res.status(200).json(role);
    } catch (error) {
        console.log(error,"Error Assigning Permission to role")
        next(error)
    }
}
// assing Role To Users
exports.assignRoleToUser = async (req, res,  next)=>{
    try {
        const { user_id}=req.body;
        const {role_id}=req.params;
        const role = await Role.findByPk(role_id);
        const user = await User.findByPk(user_id);
        if (! role) {
            throw new CustomError(`Role With Id: ${role_id} Not Found`)
        }
        if (! user) {
            throw new CustomError(`User With Id: ${user_id} Not Found`)
        }
        await role.setUser(user);
        return res.status(200).json(role);
    } catch (error) {
        console.log(error,"Error Assigning Permission to role")
        next(error)
    }
}
exports.createUser = async (req, res, next)=>{
    try {
        let transaction;
        const {employee_id, first_name, last_name, middle_name,nationality,marital_status,gender,date_of_birth,address, username, email, phone_number, sector_id, role_id}=req.body;
        let password = generatePassword().toString();
        const hashed_password=await bcrypt.hash(password, 10);
        transaction=sequelize.transaction();
        const result = await sequelize.transaction(async(t)=>{
            const sector = await Sector.findByPk(sector_id, {transaction:t});
            const role = await Role.findByPk(role_id, {transaction:t});
            if (sector==null || role== null) {
                t.rollback();
                throw new CustomError(`Role or Sector  is Not Found With Id: ${role_id}`, 404);
            }
            const user = await User.create({
                username,
                email,
                password:hashed_password,
                phone_number,
                employee_id,
                first_name,
                last_name,
                middle_name,
                nationality,
                marital_status,
                gender,
                date_of_birth,
                address,
                valid_identification: req.files['valid_identification'] ? req.files['valid_identification'][0].filename : null,
                gurantee_document: req.files['gurantee_document'] ? req.files['gurantee_document'][0].filename : null,
                educational_document: req.files['educational_document'] ? req.files['educational_document'][0].filename : null
            }, {transaction:t})
            await user.addRole(role, {transaction:t});
            await user.setSector(sector, {transaction:t});
            await sector.addUser(user, {transaction:t});
        return res.status(201).json(user);
        })
    } catch (error) {
        console.log(error, "Error");
        next(error);
    }
}
exports.assignUserToSector = async (req, res,  next)=>{
    try {
        const { user_id, sector_id, role_id}=req.body;
        const sector = await Sector.findByPk(sector_id);
        const user = await User.findByPk(user_id, {include:{model:Sector, as:'sector'}});
       
        const role = await Role.findByPk(role_id, {include:{
            model:User
        }});
        
        if (! sector) {
            throw new CustomError(`Sector With Id: ${sector_id} Not Found`)
        }
        if (! user) {
            throw new CustomError(`User With Id: ${user_id} Not Found`)
        }
        if (!role) {
            throw new CustomError(`Role With Id: ${role} Not Found`) 
        }
        
        // await sector.removeUser();
        await user.setSector(sector);
        await sector.addUser(user);
        await user.setRoles([]);
        await user.addRole(role);
        return res.status(200).json(sector);
    } catch (error) {
        console.log(error,"Error")
        next(error)
    }
}
exports.removeUserFromSector = async (req, res,next)=>{
    try {
        const {user_id, sector_id}=req.body;
        const user = await User.findByPk(user_id,{include:{
            model:Role,

        }});
      
        const sector=await Sector.findByPk(sector_id);
        if (!user || !sector) {
            throw new CustomError("Not Found", 404);
        }
        if (user.sector_id &&  user.Roles?.length>0) {
            user.sector_id=null;
            await user.save()
            await sector.removeUser(user);
            await user.setRoles([]); 
            return res.status(200).json({message:"removed"});
        }else{
            throw new CustomError(`User with Id: ${user_id} is not found under ${sector_id}`, 400);
        }
        
        
    } catch (error) {
        next(error);
    }
}
// Get All Users
exports.getAllUsers = async (req, res, next)=>{
    try {
        console.log(req?.role, "role");
        let users;
        if (req?.role.includes('SUPER_ADMIN')) {
        users = await User.findAll({where:{}, attributes:{exclude:['password']}});   
        }else{
            let zone_user_id;
            let woreda_id;
            let sector_ids=[];
            let woreda_ids=[];
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
              if (currentUser?.sector?.Zone) {
                zone_user_id=currentUser?.sector?.Zone.zone_user_id;
                let woredas = await Woreda.findAll({where:{zoneZoneUserId:zone_user_id}});
                woredas.forEach(woreda=>{woreda_ids.push(woreda.woreda_id)});
                let sectors= await Sector.findAll({
                    where:{
                        [Op.or]: [{ zone_id: zone_user_id }, { woreda_id: {[Op.in]:woreda_ids} }],
                    }
                    
                })
                sectors.forEach(sector => {
                    sector_ids.push(sector.sector_id);
                });
                console.log(sector_ids, "Sector Ids")
                
                users=await User.findAll(
                    {where:{sector_id:{[Op.in]:sector_ids}},attributes:{exclude:['password']}}
                )
                return res.status(200).json(users);
              }
              if (currentUser?.sector?.Woreda) {
                woreda_id=currentUser?.sector?.Woreda?.woreda_id;
                let sectors = await Sector.findAll({
                    where:{
                        woreda_id:woreda_id
                    },
                    include:{
                        model:Woreda,
                        where:{
                          woreda_id:woreda_id  
                        }
                    }
                })
                sectors.forEach(sector => {
                  sector_ids.push(sector?.sector_id)  
                });
                users=await User.findAll(
                    {where:{sector_id:{[Op.in]:sector_ids}},attributes:{exclude:['password']}}
                )

                return res.status(200).json(users);
              }

        }
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getUserById = async (req, res, next)=>{
    try {
        const {user_id}=req.params;
        const user = await User.findByPk(user_id, {
            attributes:{exclude:['password']},
            include:[
                {model:Role},
                {
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
                  }

            ]
           
          

        });
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.transferRequest = async (req, res, next)=>{
    try {
        const {user_id, sector_id}=req.body;
        const user = await User.findByPk(user_id);
        const sector = await Sector.findByPk(sector_id);
        if (!user || !sector) {
            throw new CustomError("User or Sector Not Found", 404);
        }
        const transferRequest = await TransferRequest.create({
            user_id,
            sector_id,
            requested_by:req.user_id,
            requested_at:new Date(),
            status:"pending"
        })
        return res.status(201).json(transferRequest);
    } catch (error) {
        next(error);
    }
}
exports.approveTransferRequest = async (req, res, next)=>{
    try {
        const {transfer_request_id}=req.params;
        const transferRequest = await TransferRequest.findByPk(transfer_request_id);
        if (!transferRequest) {
            throw new CustomError("Transfer Request Not Found", 404);
        }
        transferRequest.status="approved";
        transferRequest.approved_by=req.user_id;
        transferRequest.approved_at=new Date();
        await transferRequest.save();
        const user = await User.findByPk(transferRequest.user_id);
        const sector = await Sector.findByPk(transferRequest.sector_id);
        if (!user || !sector) {
            throw new CustomError("User or Sector Not Found", 404);
        }
        await user.setSector(sector);
        await sector.addUser(user);
        return res.status(200).json(transferRequest);
        
    } catch (error) {
        next(error);
    }
}
exports.getTransferRequest = async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(req.user_id, {
            include: [{
                model: Sector,
                as: "sector",
                include: [{
                    model: Zone,
                }, {
                    model: Woreda,
                    include: {
                        model: Zone,
                        as: 'zone'
                    }
                }]
            }]
        });

        let transferRequests = [];
        
        // If user is in a Zone-level sector
        if (currentUser?.sector?.Zone) {
            const zone_id = currentUser.sector.Zone.zone_user_id;
            
            // Get all woredas under this zone
            const woredas = await Woreda.findAll({
                where: { zoneZoneUserId: zone_id }
            });
            const woreda_ids = woredas.map(woreda => woreda.woreda_id);

            // Get all sectors under this zone (both direct and through woredas)
            const sectors = await Sector.findAll({
                where: {
                    [Op.or]: [
                        { zone_id: zone_id },
                        { woreda_id: { [Op.in]: woreda_ids } }
                    ]
                }
            });
            const sector_ids = sectors.map(sector => sector.sector_id);

            // Get transfer requests for all these sectors
            transferRequests = await TransferRequest.findAll({
                where: {
                    sector_id: { [Op.in]: sector_ids },
                    status: "pending"
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['username', 'email', 'phone_number']
                    },
                    {
                        model: Sector,
                        as: "sector",
                        include: [
                            { model: Zone },
                            { model: Woreda }
                        ]
                    },
                    {
                        model: User,
                        as: "requestedBy",
                        attributes: ['username', 'email']
                    }
                ]
            });
        }
        // If user is in a Woreda-level sector
        else if (currentUser?.sector?.Woreda) {
            const woreda_id = currentUser.sector.Woreda.woreda_id;
            
            // Get all sectors under this woreda
            const sectors = await Sector.findAll({
                where: { woreda_id: woreda_id }
            });
            const sector_ids = sectors.map(sector => sector.sector_id);

            // Get transfer requests for sectors under this woreda
            transferRequests = await TransferRequest.findAll({
                where: {
                    sector_id: { [Op.in]: sector_ids },
                    status: "pending"
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['username', 'email', 'phone_number']
                    },
                    {
                        model: Sector,
                        as: "sector",
                        include: [
                            { model: Zone },
                            { model: Woreda }
                        ]
                    },
                    {
                        model: User,
                        as: "requestedBy",
                        attributes: ['username', 'email']
                    }
                ]
            });
        }
        // For regular users, only show their own transfer requests
        else {
            transferRequests = await TransferRequest.findAll({
                where: {
                    requested_by: currentUser.user_id
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['username', 'email', 'phone_number']
                    },
                    {
                        model: Sector,
                        as: "sector",
                        include: [
                            { model: Zone },
                            { model: Woreda }
                        ]
                    }
                ]
            });
        }

        return res.status(200).json(transferRequests);
        
    } catch (error) {
        next(error);
    }
}

exports.getApprovedTransferRequest = async (req, res, next)=>{
    try {
        const currentUser = await User.findByPk(req.user_id, {
            include: [{
                model: Sector,
                as: "sector",
                include: [{
                    model: Zone,
                }, {
                    model: Woreda,
                    include: {
                        model: Zone,
                        as: 'zone'
                    }
                }]
            }]
        });

        let transferRequests = [];
        
        // If user is in a Zone-level sector
        if (currentUser?.sector?.Zone) {
            const zone_id = currentUser.sector.Zone.zone_user_id;
            
            // Get all woredas under this zone
            const woredas = await Woreda.findAll({
                where: { zoneZoneUserId: zone_id }
            });
            const woreda_ids = woredas.map(woreda => woreda.woreda_id);

            // Get all sectors under this zone (both direct and through woredas)
            const sectors = await Sector.findAll({
                where: {
                    [Op.or]: [
                        { zone_id: zone_id },
                        { woreda_id: { [Op.in]: woreda_ids } }
                    ]
                }
            });
            const sector_ids = sectors.map(sector => sector.sector_id);

            // Get transfer requests for all these sectors
            transferRequests = await TransferRequest.findAll({
                where: {
                    sector_id: { [Op.in]: sector_ids },
                    status: "approved"
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['username', 'email', 'phone_number']
                    },
                    {
                        model: Sector,
                        as: "sector",
                        include: [
                            { model: Zone },
                            { model: Woreda }
                        ]
                    },
                    {
                        model: User,
                        as: "requestedBy",
                        attributes: ['username', 'email']
                    }
                ]
            });
        }
        // If user is in a Woreda-level sector
        else if (currentUser?.sector?.Woreda) {
            const woreda_id = currentUser.sector.Woreda.woreda_id;
            
            // Get all sectors under this woreda
            const sectors = await Sector.findAll({
                where: { woreda_id: woreda_id }
            });
            const sector_ids = sectors.map(sector => sector.sector_id);

            // Get transfer requests for sectors under this woreda
            transferRequests = await TransferRequest.findAll({
                where: {
                    sector_id: { [Op.in]: sector_ids },
                    status: "approved"
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['username', 'email', 'phone_number']
                    },
                    {
                        model: Sector,
                        as: "sector",
                        include: [
                            { model: Zone },
                            { model: Woreda }
                        ]
                    },
                    {
                        model: User,
                        as: "requestedBy",
                        attributes: ['username', 'email']
                    }
                ]
            });
        }
        // For regular users, only show their own transfer requests
        else {
            transferRequests = await TransferRequest.findAll({
                where: {
                    requested_by: currentUser.user_id
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['username', 'email', 'phone_number']
                    },
                    {
                        model: Sector,
                        as: "sector",
                        include: [
                            { model: Zone },
                            { model: Woreda }
                        ]
                    }
                ]
            });
        }

        return res.status(200).json(transferRequests);
        
    } catch (error) {
        next(error);
    }
}

exports.getRejectedTransferRequest = async (req, res, next)=>{
    try {
        const currentUser = await User.findByPk(req.user_id, {
            include: [{
                model: Sector,
                as: "sector",
                include: [{
                    model: Zone,
                }, {
                    model: Woreda,
                    include: {
                        model: Zone,
                        as: 'zone'
                    }
                }]
            }]
        });

        let transferRequests = [];
        
        // If user is in a Zone-level sector
        if (currentUser?.sector?.Zone) {
            const zone_id = currentUser.sector.Zone.zone_user_id;
            
            // Get all woredas under this zone
            const woredas = await Woreda.findAll({
                where: { zoneZoneUserId: zone_id }
            });
            const woreda_ids = woredas.map(woreda => woreda.woreda_id);

            // Get all sectors under this zone (both direct and through woredas)
            const sectors = await Sector.findAll({
                where: {
                    [Op.or]: [
                        { zone_id: zone_id },
                        { woreda_id: { [Op.in]: woreda_ids } }
                    ]
                }
            });
            const sector_ids = sectors.map(sector => sector.sector_id);

            // Get transfer requests for all these sectors
            transferRequests = await TransferRequest.findAll({
                where: {
                    sector_id: { [Op.in]: sector_ids },
                    status: "rejected"
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['username', 'email', 'phone_number']
                    },
                    {
                        model: Sector,
                        as: "sector",
                        include: [
                            { model: Zone },
                            { model: Woreda }
                        ]
                    },
                    {
                        model: User,
                        as: "requestedBy",
                        attributes: ['username', 'email']
                    }
                ]
            });
        }
        // If user is in a Woreda-level sector
        else if (currentUser?.sector?.Woreda) {
            const woreda_id = currentUser.sector.Woreda.woreda_id;
            
            // Get all sectors under this woreda
            const sectors = await Sector.findAll({
                where: { woreda_id: woreda_id }
            });
            const sector_ids = sectors.map(sector => sector.sector_id);

            // Get transfer requests for sectors under this woreda
            transferRequests = await TransferRequest.findAll({
                where: {
                    sector_id: { [Op.in]: sector_ids },
                    status: "rejected"
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['username', 'email', 'phone_number']
                    },
                    {
                        model: Sector,
                        as: "sector",
                        include: [
                            { model: Zone },
                            { model: Woreda }
                        ]
                    },
                    {
                        model: User,
                        as: "requestedBy",
                        attributes: ['username', 'email']
                    }
                ]
            });
        }
        // For regular users, only show their own transfer requests
        else {
            transferRequests = await TransferRequest.findAll({
                where: {
                    requested_by: currentUser.user_id
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['username', 'email', 'phone_number']
                    },
                    {
                        model: Sector,
                        as: "sector",
                        include: [
                            { model: Zone },
                            { model: Woreda }
                        ]
                    }
                ]
            });
        }

        return res.status(200).json(transferRequests);
        
    } catch (error) {
        next(error);
    }
}

exports.rejectTransferRequest = async (req, res, next)=>{
    try {
        const {transfer_request_id}=req.params;
        const transferRequest = await TransferRequest.findByPk(transfer_request_id);
        if (!transferRequest) {
            throw new CustomError("Transfer Request Not Found", 404);
        }   
        transferRequest.status="rejected";
        transferRequest.rejected_by=req.user_id;
        transferRequest.rejected_at=new Date();
        await transferRequest.save();
        return res.status(200).json(transferRequest);
    } catch (error) {
        next(error);
    }
}

// Suspend User
exports.suspendUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user = await User.findByPk(user_id);
        
        if (!user) {
            throw new CustomError("User not found", 404);
        }

        // Check if user is already suspended
        if (!user.is_active) {
            throw new CustomError("User is already suspended", 400);
        }

        user.is_active = false;
        user.suspended_at = new Date();
        user.suspended_by = req.user_id;
        await user.save();

        return res.status(200).json({
            message: "User suspended successfully",
            user: {
                user_id: user.user_id,
                username: user.username,
                suspended_at: user.suspended_at
            }
        });
    } catch (error) {
        next(error);
    }
};

// Activate User
exports.activateUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user = await User.findByPk(user_id);
        
        if (!user) {
            throw new CustomError("User not found", 404);
        }

        // Check if user is already active
        if (user.is_active) {
            throw new CustomError("User is already active", 400);
        }

        user.is_active = true;
        user.suspended_at = null;
        user.suspended_by = null;
        await user.save();

        return res.status(200).json({
            message: "User activated successfully",
            user: {
                user_id: user.user_id,
                username: user.username
            }
        });
    } catch (error) {
        next(error);
    }
};

// Request Password Reset
exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new CustomError("No user found with this email address", 404);
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save token to user
        user.password_reset_token = hashedToken;
        user.password_reset_expires = new Date(Date.now() + 30 * 60 * 1000); // Token expires in 30 minutes
        await user.save();

        // Send email with reset link
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 30 min)',
                message
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });
        } catch (err) {
            user.password_reset_token = null;
            user.password_reset_expires = null;
            await user.save();

            throw new CustomError('There was an error sending the email. Try again later!', 500);
        }
    } catch (error) {
        next(error);
    }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash the token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            where: {
                password_reset_token: hashedToken,
                password_reset_expires: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            throw new CustomError('Token is invalid or has expired', 400);
        }

        // Update password
        const hashed_password = await bcrypt.hash(password, 10);
        user.password = hashed_password;
        user.password_reset_token = null;
        user.password_reset_expires = null;
        await user.save();

        // Generate new JWT token
        const newToken = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.Roles?.map((r) => r.role_name)
            },
            config.get('jwt.secret'),
            { expiresIn: "24h" }
        );

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully',
            token: newToken
        });
    } catch (error) {
        next(error);
    }
};

