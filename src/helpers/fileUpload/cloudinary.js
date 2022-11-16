const cloudinary = require('cloudinary').v2

const {
    cloudinary: { cloudName, apiKey, apiSecret },
} = require('../../config')

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
})

module.exports = cloudinary
