const joi = require('joi')
const { joiAuthBearer } = require('../helpers/validators')

module.exports = {
    auth: joi
        .object({
            authorization: joiAuthBearer().required(),
        })
        .unknown(true),
}
