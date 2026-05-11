const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('Todo', 'In Progress', 'Completed').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  due_date: Joi.date().allow(null).optional(),
  assigned_to: Joi.number().integer().allow(null).optional(),
  team_id: Joi.number().integer().required()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('Todo', 'In Progress', 'Completed').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  due_date: Joi.date().allow(null).optional(),
  assigned_to: Joi.number().integer().allow(null).optional()
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
