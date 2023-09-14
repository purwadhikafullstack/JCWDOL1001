const multer = require ("multer");
const { v2 } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require ("path");
const {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME} = require("../config/index.js");

// @configure storage
const createDiskStorage = (directory) => multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, directory)
    },
    filename: (req, file, cb) => {
        // @if image type is valid
        cb(null, "IMG" + "-" + Date.now() + path.extname(file.originalname))
    }
})

// @configure cloudinary storage
v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})
const createCloudinaryStorage = (directory, id=1) => new CloudinaryStorage({
    cloudinary: v2,
    params: {
        folder: directory,
        public_id: (req, file) => {
            const type = directory.split("/")[1]
            if(type === "Profiles")
            return `IMG-${req?.user?.userId}`
            if(type !== "Profiles")
            return 'IMG-' + Date.now()
        },
        allowedFormats: ['png', 'jpg', 'gif'],
        invalidate : true
    }
})

// @configure upload
const createUploader = (storage) => multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // @1MB
    use_filename: true, 
    unique_filename: false
})

const deleteImage= async(publicId) => {
    try {
        v2.uploader.destroy(publicId, function () {
        });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    createDiskStorage,
    createCloudinaryStorage,
    createUploader ,
    deleteImage
}