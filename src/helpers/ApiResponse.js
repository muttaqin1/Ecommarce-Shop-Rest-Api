class ApiResponse {
    constructor(res) {
        this.Response = res
        this.Status = 200
        this.Success = true
        this.Data = {}
        this.Message = ''
    }
    removeCookie(name) {
        this.Response.clearCookie(name)
        return this
    }
    status(status) {
        this.Status = status
        return this
    }
    data(data) {
        this.Data = data
        return this
    }
    msg(msg) {
        this.Message = msg
        return this
    }
    success() {
        return this.Status === 200 ? true : false
    }
    send() {
        const resObject = {
            StatusCode: this.Status,
            Success: this.success(),
            Data: this.Data,
            Message: this.Message,
        }
        if (!resObject.Message) delete resObject.Message
        if (Object.keys(resObject.Data).length <= 0) delete resObject.Data

        return this.Response.status(resObject.StatusCode).json(resObject)
    }
}

module.exports = ApiResponse
