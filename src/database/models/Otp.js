const { Schema, model } = require('mongoose')

const schema = new Schema({
    otp: {
        type: String,
        required: true,
        trim: true,
    },
    holder: {
        type: String,
        required: true,
        trim: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '10m',
    },
})

const Otp = new model('otp', schema)
module.exports = Otp
