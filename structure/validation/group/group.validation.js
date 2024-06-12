
const Joi = require("joi");
const createGroupValidation = (req, res, next) => {
    // Define Joi schema for the form data
    
    const schema = Joi.object({
      group_name: Joi.string().required(),
      leader_id: Joi.string().guid({ version: ['uuidv4'] }).required(),
      sector_id: Joi.string().guid({ version: ['uuidv4'] }).required(),
      members_id:Joi.array()
      
    });
  
    // Validate the request body
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error, "error");
      return res.status(400).json({ error: error.details[0].message });
    }
  
    next();
  };


module.exports = {
    createGroupValidation, 
    
  };
