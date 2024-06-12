
const Joi = require("joi");
const registrationValidation = (req, res, next) => {
  // Define Joi schema for the form data
  const phonePattern = /^(\+251|0)9\d{8}$/;
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone_number: Joi.string().pattern(phonePattern),
    password:Joi.string().required()
    
  });

  // Validate the request body
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error, "error");
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
const loginValidation = (req, res, next) => {
  // Define Joi schema for the form data
  
  const schema = Joi.object({
    username: Joi.string().required(),
    password:Joi.string().required()
    
  });

  // Validate the request body
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const createGroupValidation  = (req, res, next) => {
  // Define Joi schema for the form data
  
  const schema = Joi.object({
    group_name: Joi.string().required(),
    leader_id:Joi.number().required(),
    members_id:Joi.array()
    
  });

  // Validate the request body
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
const updateGroupValidation  = (req, res, next) => {
  // Define Joi schema for the form data
  
  const schema = Joi.object({
    members_id:Joi.array().required()
  });

  // Validate the request body
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
const assignRoleToUserValidation = (req, res, next) => {
  // Define Joi schema for the form data
  const schema = Joi.object({
    role_id: Joi.number().required()
  });

  const bodySchema = Joi.object({
    user_id: Joi.number().required()
  });

  // Validate the query parameters
  const { error: queryError } = schema.validate(req.params);
  if (queryError) {
    return res.status(400).json({ error: queryError.details[0].message });
  }

  // Validate the request body
  const { error: bodyError } = bodySchema.validate(req.body);
  if (bodyError) {
    return res.status(400).json({ error: bodyError.details[0].message });
  }

  next();
};

const creteUserValidation = (req, res, next) => {
  // Define Joi schema for the form data
  const phonePattern = /^(\+251|0)9\d{8}$/;
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone_number: Joi.string().pattern(phonePattern),
    sector_id:Joi.string().guid({ version: ['uuidv4'] }).required(),
    role_id:Joi.number().positive().required()
    
    
  });

  // Validate the request body
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error, "error");
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
const assignUserToSectorValidation = (req, res, next) => {
  // Define Joi schema for the form data
  const schema = Joi.object({
    user_id: Joi.string().guid({version:"uuidv4"}).required(),
    role_id: Joi.number().required(),
    sector_id:Joi.string().guid({version:"uuidv4"}).required()
  });



  // Validate the request body
  const { error: bodyError } = schema.validate(req.body);
  if (bodyError) {
    return res.status(400).json({ error: bodyError.details[0].message });
  }

  next();
};

const removeUserFromSectorValidation = (req, res, next) => {
  // Define Joi schema for the form data
  const schema = Joi.object({
    user_id: Joi.string().guid({version:"uuidv4"}).required(),
    
    sector_id:Joi.string().guid({version:"uuidv4"}).required()
  });



  // Validate the request body
  const { error: bodyError } = schema.validate(req.body);
  if (bodyError) {
    return res.status(400).json({ error: bodyError.details[0].message });
  }

  next();
};
module.exports = {
    registrationValidation, 
    loginValidation, 
    createGroupValidation,
    updateGroupValidation, 
    assignRoleToUserValidation,
    creteUserValidation,
    assignUserToSectorValidation,
    removeUserFromSectorValidation
  };
