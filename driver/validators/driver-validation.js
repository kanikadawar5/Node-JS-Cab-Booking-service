const Joi = require('joi')

exports.validateDriver = (req, res, next) => {
        const schema = {
                username: Joi.string().min(3).required(),
                password: Joi.string().min(3).required(),
                first_name: Joi.string().min(3),
                last_name: Joi.string(),
                phone_number: Joi.number().min(10),
                email_id: Joi.string().email()
        }
        Joi.validate(req,schema)
        next()
}