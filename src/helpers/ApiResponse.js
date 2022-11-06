class ApiResponse {
    constructor() {
        this.Status = 200
        this.Success = true
        this.Data = {}
        this.Message = ''
    }

    status(status) {
        this.Status = status
        return this
    }
    success(success) {
        this.Success = success
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
    send(res) {
        const resObject = {
            StatusCode: this.Status,
            Success: this.Success,
            Data: this.Data,
            Message: this.Message,
        }
        if (!resObject.Message) delete resObject.Message
        if (Object.keys(resObject.Data).length <= 0) delete resObject.Data

        return res.status(resObject.StatusCode).json(resObject)
    }
}

module.exports = new ApiResponse()
