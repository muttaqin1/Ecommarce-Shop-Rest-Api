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
        return await Otp.findById(id)
    }
    static async FindByEmail(email) {
        return await Otp.findOne({ holder: email })
    }
    static async Verify(id, bool) {
        return await Otp.findOneAndUpdate(
            { _id: id },
            {
                verified: bool,
            },
            {
                new: true,
            }
        )
    }
    static async Remove(id) {
        return await Otp.findByIdAndDelete(id)
    }
}

module.exports = OtpRepository
