
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
const addMembersToGroupValidation  = (req, res, next) => {
    // Define Joi schema for the form data
    
    const schema = Joi.object({
      members_id:Joi.array().required()
    });

    const paramsSchema = Joi.object({
        group_id:Joi.number().positive().required()
      });
    // Validate the query parameters
    const { error: queryError } = paramsSchema.validate(req.params);
    if (queryError) {
      return res.status(400).json({ error: queryError.details[0].message });
    }
    // Validate the request body
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    next();
  };

module.exports = {
    createGroupValidation,
    addMembersToGroupValidation
    
  };
