const Joi = require("@hapi/joi");

const registerValidations = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .required(),
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()   
    });
    return  schema.validate(data);
}

const loginValidations = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return  schema.validate(data);
}

const noteValidations = (data) => {
    const schema = Joi.object({
        title: Joi.string()
            .required(),
        description: Joi.string()
            .required()
    });
    return  schema.validate(data);
}

module.exports.loginValidations =   loginValidations; 
module.exports.registerValidations = registerValidations; 
module.exports.noteValidations =   noteValidations; 