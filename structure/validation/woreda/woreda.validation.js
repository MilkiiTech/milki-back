
const Joi = require("joi");
const createWoredaValidation = (req, res, next) => {
  // Define Joi schema for the form data
  const phonePattern = /^(\+251|0)9\d{8}$/;
  const schema = Joi.object({
    userDetail: Joi.object({
      username:Joi.string().required(),
      email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      phone_number: Joi.string().pattern(phonePattern),
  }),
  woredaDetail: Joi.object({
      woreda_name:Joi.string().required(),
      email_address: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      contact_phone_number: Joi.string().pattern(phonePattern),
      city_name:Joi.string().required(),
  }),
  role_id:Joi.number().required(),
  zone_id:Joi.string().guid({ version: ['uuidv4'] }).required()
    
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
    createWoredaValidation, 
    
  };
