const { CustomerRepository } = require('../database')
const customerRepository = new CustomerRepository()
const nodemailer = require('nodemailer')
const { STATUS_CODES, APIError } = require('./AppError')
const codeGenerator = require('./codeGenerator')
const {
    app_name,
    Nodemailer: { SMTP_EMAIL, SMTP_PASSWORD },
} = require('../config')

const sendMail = ({ title, body, reciever }) =>
    new Promise(async (resolve, reject) => {
        try {
            const mailOptions = {
                from: SMTP_EMAIL,
                to: reciever,
                subject: title,
                text: body,
            }
            //creating a transport
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: SMTP_EMAIL,
                    pass: SMTP_PASSWORD,
                },
                port: 465,
                host: 'smtp@gmail.com',
            })
            //sending mail
            const { envelope } = await transporter.sendMail(mailOptions)
            /*the transporter.sendMail function returns a object and
 we can find the email recivers email inside that object . so i am checking if the user email exists there
           */
            if (envelope.to?.indexOf(reciever) === -1) throw new Error('')
            resolve(true)
        } catch {
            reject(new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to send Email!'))
        }
    })

const sendOtp = async (reciever) => {
    try {
        const user = await customerRepository.FindByEmail(reciever)
        if (!user) throw new BadRequestError('Customer is not registered')
        const otp = codeGenerator(6)
        if (!otp) throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR)
        //mail body
        const title = `${otp} is your ${app_name} account recovery code.`
        const body = `Hi ${user.name},
                      We received a request to reset your ${app_name} password.
                      Enter the following code reset your password:
                                  [ ${otp} ]  `
        const sendmail = await sendMail({ title, body, reciever })
        if (!sendmail)
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to send Email.')
        return otp
    } catch (e) {
        throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, e.message)
    }
}

module.exports = {
    sendMail,
    sendOtp,
}
