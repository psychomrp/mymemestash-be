const cloudinary = require('cloudinary');
require('dotenv').config();

const fs = require('fs');
const os = require('os');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function upload(file, folder) {
    const tempFilePath = `${os.tmpdir()}/${file.originalname}`;
  
    try {
      fs.writeFileSync(tempFilePath, file.buffer);
  
      const options = {
        public_id: folder,
      };
  
      const result = await cloudinary.v2.uploader.upload(tempFilePath, options);
  
      // Construct the URLs for original and compressed versions
      const originalURL = result.url;
      const compressedURL = cloudinary.url(result.public_id, {
        transformation: [
          { width: result.width, height: result.height, crop: 'limit' },
          { format: 'auto', quality: 'auto:eco' }
        ]
      });
  
      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
  
      return { original: originalURL, compressed: compressedURL };
    } catch (error) {
      console.error('Error uploading file:', error);
    }
}  
  

module.exports = { upload };