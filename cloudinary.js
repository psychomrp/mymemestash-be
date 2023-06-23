const cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function upload(file, folder) {
    cloudinary.v2.uploader.upload(file,
        { public_id: folder },
        function (error, result) { console.log(result); });
}

exports.module = { upload };