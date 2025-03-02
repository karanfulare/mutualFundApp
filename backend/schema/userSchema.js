const Joi = require("joi");

module.exports = {
    adduser:Joi.object().keys({
        username:Joi.string().required(),
        email:Joi.string().email().required(),
        password:Joi.string().alphanum().length(6).required()
    }),
    loginuser:Joi.object().keys({
        email:Joi.string().email().required(),
        password:Joi.string().alphanum().length(6).required()
    })
}