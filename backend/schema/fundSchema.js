const Joi = require("joi");

module.exports = {
    fundfam:Joi.object().keys({
        family:Joi.string().required()
    }),
    addToPortfolio:Joi.object().keys({
        scheme_code:Joi.number().required(),
        units:Joi.number().required()
    })
}