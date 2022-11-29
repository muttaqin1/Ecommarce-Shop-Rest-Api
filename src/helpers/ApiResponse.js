/*
 * Author:Muttaqin Muhammad
 * email:mdmuttaqin20@gmail.com
 * facebook:https://www.facebook.com/Muttaqin01
 * description: Creating a class to send response and prevent code repeating. .
 */
class ApiResponse {
    constructor(res) {
        this.Response = res
        this.Status = 200
        this.Success = true
        this.Data = {}
        this.Message = ''
    }
    status(status) {
        if (!status && typeof status !== 'number')
            throw new TypeError('Status must be a valid number')
        this.status = status
        return this
    }
    sendCookie(name, expiry, payload) {
        if (!payload && !name) throw new TypeError('Name and payload is required to send a cookie.')
        this.Response.cookie(name, payload, {
            secured: true,
            httpOnly: true,
            signed: true,
            maxAge: expiry,
        })
        return this
    }
    removeCookie(name) {
        if (!name) throw new TypeError('Name is required to remove a cookie.')
        this.Response.clearCookie(name)
        return this
    }
    data(data) {
        if (Object.keys(data).length <= 0 && typeof data !== 'object')
            throw new TypeError('Data is required and it must be a valid object.')
        this.Data = data
        return this
    }
    msg(msg) {
        if (!msg && msg.length <= 0 && typeof msg !== 'string')
            throw new TypeError('Message is required and it must be a valid  string.')
        this.Message = msg
        return this
    }
    success() {
        return this.Status === 200 ? true : false
    }
    send() {
        const payload = {
            Success: this.success(),
            StatusCode: this.Status,
            Message: this.Message,
        }
        Object.assign(payload, this.Data)
        if (!payload.Message) delete payload.Message
        return this.Response.status(payload.StatusCode).json(payload)
    }
}
module.exports = ApiResponse
