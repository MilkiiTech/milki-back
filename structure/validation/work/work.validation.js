const Joi = require('joi');

const createWorkValidation = (req, res, next) => {
  // Define Joi schema for the form data
  const schema = Joi.object({
    description: Joi.string().required(),
    // assignedBy: Joi.number().integer().required(), // Uncomment if this field is needed
    // sectorId: Joi.number().integer().required(), // Uncomment if this field is needed
    plannedStartDate: Joi.date().iso().required(),
    plannedEndDate: Joi.date().iso().required(),
    quality: Joi.string().valid('High', 'Medium', 'Low').required(),
    quantity: Joi.number().integer().positive().required(),
    timeRequired: Joi.number().positive().required(),
    cost: Joi.number().precision(2).positive().required()
  });

  // Validate the request body
  const { error } = schema.validate(req.body);
  if (error) {
    console.error('Validation Error:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
const createWeaklyTaskValidation = (req, res, next) => {
  // Define Joi schema for the form data
  const schema = Joi.object({
    description: Joi.string().required(),
    weekNumber: Joi.string().number(),
    workId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    sectorId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    
  });

  // Validate the request body
  const { error } = schema.validate(req.body);
  if (error) {
    console.error('Validation Error:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
module.exports = {createWorkValidation, createWeaklyTaskValidation};
