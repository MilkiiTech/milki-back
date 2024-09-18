
const Joi = require("joi");
const createZoneAdminValidation = (req, res, next) => {
  // Define Joi schema for the form data
  const phonePattern = /^(\+251|0)9\d{8}$/;
  
  const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    phone_number: Joi.string().pattern(phonePattern).required(),
    sector_name: Joi.string().required(), // Included here to validate inside users array
    sector_phone_number:Joi.string(),
    sector_email_address:Joi.string(),
    sector_address:Joi.string(),
    role_id: Joi.number().required() // Included here to validate inside users array
  });

  const zoneSchema = Joi.object({
    zone_name: Joi.string().required(),
    city_name: Joi.string().required(),
    email_address: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    contact_phone_number: Joi.string().pattern(phonePattern).required(),
    address: Joi.string()
    
  });

  const schema = Joi.object({
    users: Joi.array().items(userSchema).required(),
    zoneDetail: zoneSchema.required()
  });

  // Validate the request body
  const { error } = schema.validate(req.body);
  if (error) {
    console.log('Validation Error:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};


module.exports = {
    createZoneAdminValidation, 
    
  };
