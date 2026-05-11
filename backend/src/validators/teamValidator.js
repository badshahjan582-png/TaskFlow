const Joi = require('joi');

const createTeamSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow('', null)
});

const addMemberSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'member').optional()
});

module.exports = {
  createTeamSchema,
  addMemberSchema
};
