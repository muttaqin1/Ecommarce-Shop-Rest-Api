/*
 * Author:Muttaqin Muhammad
 * email:mdmuttaqin20@gmail.com
 * facebook:https://www.facebook.com/Muttaqin01
 * description: Creating an array of middleware to complete the full image upload operation and use it in any router.
 */

const multer = require('./multer')
const cloudinary = require('./cloudinary')

const imageUpload = (folderName) => async (req, res, next) => {
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: folderName,
        })
        const { secure_url, public_id } = result
        req.image = {
            url: secure_url,
            publicId: public_id,
        }
    }

    next()
}

module.exports = (fieldName, folderName) => [multer.single(fieldName), imageUpload(folderName)]
