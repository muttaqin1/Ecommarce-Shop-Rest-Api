const multer = require('./multer')
const {
    uploader: { upload: uploadImage },
} = require('./cloudinary')
//this middleware checks the req.file and upload the image into cloudinary
const imageUpload = (folderName) => async (req, res, next) => {
    if (req.file) {
        const { secure_url, public_id } = await uploadImage(req.file.path, {
            folder: folderName,
        })
        req.image = {
            url: secure_url,
            publicId: public_id,
        }
    }

    next()
}
//routers can take a array of middlewares. this function returns an array of middlewares
module.exports = (fieldName, folderName) => [multer.single(fieldName), imageUpload(folderName)]
