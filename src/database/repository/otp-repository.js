const Otp = require('../models/Otp')
const { APIError, STATUS_CODES } = require('../../helpers/AppError')

class OtpRepository {
    static async Create(otp, holder) {
        try {
            return await Otp.create({
                otp,
                holder,
            })
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR)
        }
    }

    static async Find(id) {
        try {
            return await Otp.findById(id)
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to find otp!')
        }
    }
    static async FindByEmail(email) {
        try {
            return await Otp.findOne({ holder: email })
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to find otp!')
        }
    }
    static async Verify(id, bool) {
        try {
            return await Otp.findOneAndUpdate(
                { _id: id },
                {
                    verified: bool,
                },
                {
                    new: true,
                }
            )
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to verify otp!')
        }
    }
    static async Remove(id) {
        try {
            return await Otp.findByIdAndDelete(id)
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to remove otp!')
        }
    }
}

module.exports = OtpRepository
