const crypto = require("crypto");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const multer = require('multer');

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const productImg = [
    {
        name: 'primiryImg'
    },
    {
        name: 'subImg1'
    },
    {
        name: 'subImg2'
    },
    {
        name: 'subImg3'
    },
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 2 * 1024 * 1024, // 2 MB
      files: 10,
  },
});

const uploadToCloudinary = (file) => {
    console.log('upload file: ', file);
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

const uploadMultipleFileToCloudinary = async (files) => {
    let primaryImage = null, subImages = [];
    await Promise.all((Object.entries(files)).map(async (image) => {
        console.log('image: ', image);
        const imageUrl = await uploadToCloudinary(image[1][0]);
        console.log('URL: ', imageUrl.url);
        if (image[0] === 'primaryImg') {
            primaryImage = imageUrl.url;
        } else {
            subImages = [...subImages, imageUrl.url];
        }
    }));
    return {primaryImage, subImages };
}
// const getUrl = async () => {
//     return await cloudinary.uploader.upload();
// }

module.exports = { generateSecretKey, uploadToCloudinary, upload, uploadMultipleFileToCloudinary };
