const sequelize = require("../../../config/db");
const {generatePassword}=require("../../../utils/utils")
const {User, Role, Work,WeeklyTask, Sector}= require("../../../user/models/association")
const bcrypt = require('bcrypt');
const CustomError = require("../../../error/customError");
const { v4: uuidv4 } = require('uuid');
const {Op}=require("sequelize");
exports.create = async (req, res, next)=>{
    // const {username, email, phone_number, password}=req.body;
    const {description, plannedStartDate,plannedEndDate,quality,quantity,timeRequired,cost}=req.body;
    try { 
        const result = await sequelize.transaction(async(t)=>{
            console.log(req.user_id);
            const currentUser = await User.findByPk(req.user_id);
            console.log(currentUser, "Fetched User");
            const work = await Work.create({
                description,
                plannedStartDate,
                plannedEndDate,
                quality,
                quantity,
                timeRequired,
                cost
            },{transaction:t})
            await work.setCreatedBy(currentUser, {transaction:t});
            
           
        return res.status(201).json(work);
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
// Find All Zones 
exports.findAll = async (req, res, next)=>{
    try {
    //     const work = await Work.findAll({where:{
            
    //     }},
    //     {
    //         include:[
    //             {
    //                 model:User,
    //                 as:"user",
                    
    //             },
    //             {
    //                 model:Sector
    //             }
    //         ]
           
        
    // });
    const work = await Work.findAll({include:[
        {model:User,as:"PickedByUser"},{model:Sector},{model:WeeklyTask}
    ]})
        return res.status(200).json(work)
    } catch (error) {
        next(error);
    }
}
// Find One
exports.findOne = async (req, res, next)=>{
    try {
        const {workId}=req.params
        const work = await Work.findByPk(workId,{include:[
            
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
        return res.status(200).json(work)
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
exports.assignWorkToSector = async (req, res,next)=>{
    const {sector_ids}=req.body;
    const {workId}=req.params;
    try {
        const work = await Work.findByPk(workId);
        const sectors = await Sector.findAll({where:{sector_id:{
            [Op.in]:sector_ids
        }}});
        
        if (!work || !sectors) {
            throw new CustomError("Work Or Sector Id Not Found", 404)
        }
        work.status="assigned";
        work.assignedBy=req.user_id;
        await work.save();
        await work.addSector(sectors);
        
        return res.status(200).json(work);
    } catch (error) {
        next(error)
    }
}
exports.getWorkByUserId = async (req, res,next)=>{
    try {
        const user = await User.findByPk(req.user_id);
        const work = await Work.findAll({
            include:[{
                model:Sector,
                where:{
                    sector_id:user.sector_id
                }
            },
        {
            model:User,
            as:"PickedByUser",
            attributes:["user_id",'username','email','phone_number']
        }]
        })
        return res.status(200).json(work);
    } catch (error) {
        next(error)
    }
}
exports.pickWork = async (req, res,next)=>{
    try {
        const {workId}=req.body;
        // const user = await User.findByPk(req.user_id);
        const work = await Work.findByPk(workId);
        await work.update({
            pickedBy:req.user_id
        });
        return res.status(200).json(work);
    } catch (error) {
        next(error)
    }
}
exports.createWeaklyTask= async (req, res, next)=>{
    try {
        const {description, workId, sectorId, weekNumber}=req.body;
        let weeks = weekNumber.toString();
        let sector = await Sector.findByPk(sectorId,{include:{model:WeeklyTask}});
        
        if (! sector) {
            throw new CustomError("No Sector Found With That Id",404)
        }
        const work = await Work.findByPk(workId,{include:{model:WeeklyTask}});
        const weeklyTasks = work.dataValues['WeeklyTask s'];
        console.log(weeklyTasks,"weeklyTasks ");
        if (Array.isArray(weeklyTasks)) {
            if (weeklyTasks.length >= 4) {
              throw new CustomError("You have Exceeded the Number of weeks need to be created", 409);
            }
          
            if (weeklyTasks.some(task => task.weekNumber.toString() === weekNumber)) {
              throw new CustomError("Week Number Already Found", 409);
            }
          }
        const weeklyTask = await WeeklyTask.create({
            description,workId, weekNumber:weeks
        });
        await weeklyTask.setWork(work);
        await weeklyTask.setSector(sector);
        return res.status(200).json(work);
    } catch (error) {
        next(error)
    }
}
exports.getWeeklyTask = async (req, res,next)=>{
    try {
        const {workId}=req.params
        const weeklyTask = await WeeklyTask.findAll({
            where:{
                workId:workId
            }
        })
        return res.status(200).json(weeklyTask);
    } catch (error) {
        next(error);
    }
}
exports.getWeeklyTaskById= async (req, res,next)=>{
    try {
        const {weekly_task_id}=req.params;
        const weeklyTask = await WeeklyTask.findByPk(weekly_task_id);
        if (!weeklyTask) {
            throw new CustomError("Not Found", 404);
        }
        return res.status(200).json(weeklyTask);
    } catch (error) {
        next(error);
    }
}
exports.updateWeeklyTask = async (req, res, next)=>{
    try {
        const {weekly_task_id}=req.params;
        const {weeklyStatus}=req.body;
        const weeklyTaskById = await WeeklyTask.findByPk(weekly_task_id, {include:{model:Work}});

        if (! weeklyTaskById) {
            throw new CustomError("Weekly Task Not Found", 404);
        }
            await weeklyTaskById.update({taskStatus:weeklyStatus});
            const work = await Work.findByPk(weeklyTaskById.Work.workId,{include:{model:WeeklyTask}});
            // const weeklyTasks = work.dataValues['WeeklyTask s'];
            const totalTasks = work.dataValues['WeeklyTask s'] ? work.dataValues['WeeklyTask s'].length : 0;
            const completedTasks = work.dataValues['WeeklyTask s'] ? work.dataValues['WeeklyTask s'].filter(task => task.taskStatus === 'DONE').length : 0;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            await work.update({progress:progress})  

        return res.status(200).json(weeklyTaskById);
    } catch (error) {
        next(error);
    }
}