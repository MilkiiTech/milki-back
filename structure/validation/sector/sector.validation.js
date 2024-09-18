
const Joi = require("joi");
const createSectorValidation = (req, res, next) => {
    // Define Joi schema for the form data
    
    const schema = Joi.object({
      sector_name: Joi.string().required(),
      // sector_type: Joi.string().valid('Zone', 'Woreda').required(),
      email_address:Joi.string(),
      phone_number:Joi.string(),
      address:Joi.string(),
      parent_sector_id:Joi.string().guid({version:['uuidv4']})
      
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
    createSectorValidation, 
    
  };
