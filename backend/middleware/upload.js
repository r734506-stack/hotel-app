const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hotel-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp','avif','gif'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp|avif|gif/;
  const isAllowed = allowed.test(file.mimetype);
  if (isAllowed) cb(null, true);
  else cb(new Error('Only images allowed (jpeg, jpg, png, webp,avif,gif)'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});