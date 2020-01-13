const cloudinary = require('cloudinary');
const { cloudName, cloudinaryApiKey, cloudinaryApiSecret } = require('../config');

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret
});

module.exports = (file) => new Promise((resolve) => {
  cloudinary.uploader.upload(file, (result) => {
    resolve(
      {
        url: result.url,
        id: result.public_id
      },
      {
        resource_type: 'auto',
        folder: 'Images'
      }
    );
  });
});
