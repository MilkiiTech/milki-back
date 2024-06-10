const CustomError = require("../../error/customError");
const Group = require("../models/group");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require('../../config/config');
const {Role, User}=require("../models/association")
const Permission = require("../models/permission");
const {Op}=require("sequelize");
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
exports.login = async (req, res, next)=>{
    const {username, password}=req.body;
    try {
        const user = await User.findOne({where:{
            username
        }, include:{
            model:Role
            
        }})
        if (! user) {
           throw new CustomError("Invalid Crederntials", 401) 
        }
       
        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) {
                throw new CustomError("Invalid Crederntials", 401) 
            } else {
              if (result === true) {
                await user.update({ lastLogin: new Date() });
                const token = jwt.sign(
                  {
                    user_id: user.user_id,
                    username: user.username,
                    role: user.Roles?.map((r)=>r.role_name)
                    
                  },
                  config.get('jwt.secret'),
                  { expiresIn: "24h" }
                );
                req.session.jwt = token;
                return res.status(200).send({ token: token });
              } else {
                return res.status(401).json("Invalid credentials");
              }
            }
          });
    } catch (error) {
        next(error)
    }
   
}
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
        
        await role.setPermissions(permissions);
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


