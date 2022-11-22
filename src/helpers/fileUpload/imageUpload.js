/*
 * Author:Muttaqin Muhammad
 * email:mdmuttaqin20@gmail.com
 * facebook:https://www.facebook.com/Muttaqin01
 * description: Creating an array of middleware to complete the full image upload operation and use it in any router.
 */

const multer = require('./multer')
const {
    uploader: { upload },
} = require('./cloudinary')

const imageUpload = (folderName) => async (req, res, next) => {
    if (req.file) {
        const { secure_url, public_id } = await upload(req.file.path, {
            folder: folderName,
        })
        req.image = {
            url: secure_url,
            publicId: public_id,
        }
    }

    next()
}

module.exports = (fieldName, folderName) => [multer.single(fieldName), imageUpload(folderName)]
