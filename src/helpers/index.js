module.exports = {
    Auth: {
        AuthUtils: require('./Auth/AuthUtils'),
        JWT: require('./Auth/JWT'),
    },
    FileUpload: {
        imageUpload: require('./fileUpload/imageUpload'),
    },

    sendMail: require('./sendMail'),
    validators: require('./validators'),
}
