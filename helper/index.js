const crypto = require("crypto");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const multer = require('multer');

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 2 * 1024 * 1024, // 2 MB
      files: 1,
  },
});

const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

module.exports = { generateSecretKey, uploadToCloudinary, upload };
