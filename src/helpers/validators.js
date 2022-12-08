const joi = require('joi')
const { BadRequestError } = require('./AppError')

const src = {
    BODY: 'body',
    HEADER: 'headers',
    QUERY: 'query',
    PARAM: 'params',
    IMAGE: 'image',
}
const stripePayload = joi.object({
    orderId: joi.string().required(),
    token: joi.string().required(),
})
const joiAuthBearer = () =>
    joi.string().custom((val, helper) => {
        if (!val.startsWith('Bearer ')) return helper.error('any.invalid')
        if (!val.split(' ')[1]) return helper.error('any.invalid')
        return val
    }, 'Authorization Header Validation')

const validator =
    (schema, source = src.BODY) =>
    (req, res, next) => {
        try {
            const { error } = schema.validate(req[source])
            if (!error) return next()
            const { details } = error
            //replacing all the unwanted characters
            const message = details.map((i) => i.message.replace(/['"\]\[]+/g, '')).join(',')

            next(new BadRequestError(message))
        } catch (e) {
            next(e)
        }
    }
module.exports = {
    validator,
    src,
    joiAuthBearer,
    stripePayload,
}
