const Joi = require('joi');

module.exports.nationalParksSchema = Joi.object({
    title: Joi.string().required(),
    entry: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required()
})

