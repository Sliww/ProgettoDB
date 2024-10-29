const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'EPISERVERUPLOADS',
        allowed_formats: ['jpg', 'png', 'gif', 'mp4'],
        format: async (req, file) => 'png',
        public_id: (req, file) => file.originalname
    }
});

const internalStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "uploads")
    },
    filename: (req, file, cb)=>{
        const oneSuffix = uuidv4();
        const todayDate = new Date();
        const fileExtension = file.originalname.split(".").pop()
        cb(null, `${file.originalname}-${oneSuffix}.${fileExtension}`)
    },
    fileFilter: (req, file, cb)=>{
        const allowedMimeTypes = [ "image/jpeg", "image/png"];
        if(allowedMimeTypes.includes(file.mimetype)){
            cb(null, true)
        } else {
            cb(new Error("File not allowed"), false)
        }
    }
})


module.exports = {
    cloudStorage,
    internalStorage
};