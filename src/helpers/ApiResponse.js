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
        if (!status && typeof status !== 'number' && status >= 1000)
            throw new Error(
                'Status is required and it must have to be Number and a valid http status code.'
            )
        this.Status = status
        return this
    }
    sendCookie(name,expiry, payload) {
        if (!payload && !name) throw new Error('Name and payload is required to send a cookie.')
        this.Response.cookie(name, payload, {
            httpOnly: true,
            signed: true,
            maxAge: expiry,
        })
        return this
    }
    removeCookie(name) {
        if (!name) throw new Error('Name is required to remove a cookie.')
        this.Response.clearCookie(name)
        return this
    }
    data(data) {
        if (!data && typeof data !== 'object')
            throw new TypeError('Data is required and it must be a valid object.')
        this.Data = data
        return this
    }
    msg(msg) {
        if (!msg && typeof msg !== 'string')
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
