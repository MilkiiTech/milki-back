
const Joi = require("joi");
const createSectorValidation = (req, res, next) => {
    // Define Joi schema for the form data
    
    const schema = Joi.object({
      sector_name: Joi.string().required(),
      sector_type: Joi.string().valid('Zone', 'Woreda').required(),
      zone_id: Joi.number().integer().positive().when('sector_type', {
        is: 'Zone',
        then: Joi.required(),
        otherwise: Joi.allow(null)
      }),
      woreda_id: Joi.number().integer().positive().when('sector_type', {
        is: 'Woreda',
        then: Joi.required(),
        otherwise: Joi.allow(null)
      })
      
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
