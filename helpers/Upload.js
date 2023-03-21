require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
// Configuration 
cloudinary.config({
  cloud_name: "dj68bj5ql",
  api_key: "599386738488988",
  api_secret: "XvJQc9L2OV3tDWxf8XRiQoKDNR8"
});

// AWS Setting
const uuid = require('uuid4')

async function uploadCloudinary(image, fileName) {
  // console.log("FILENAME", fileName);
  // console.log("Image", image);
  const res = cloudinary.uploader.upload(image, {
    public_id: fileName
  })

  res.then((data) => {
    console.log("Success Uploading Images");
    return data.secure_url
  }).catch((err) => {
    console.log(err);
    return
  });
  const url = cloudinary.url(fileName);
  console.log(url);
  return url
}

async function uploadToCloudinary(locaFilePath) {
  var mainFolderName = "main"
  // filePathOnCloudinary :
  // path of image we want when it is uploded to cloudinary
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath

  return cloudinary.uploader.upload(locaFilePath, {
          "public_id": filePathOnCloudinary
      })
      .then((result) => {
          // Image has been successfully uploaded on cloudinary
          // So we dont need local image file anymore
          // Remove file from local uploads folder 
          fs.unlinkSync(locaFilePath)

          return {
              message: "Success",
              url: result.url
          };
      }).catch((error) => {
          // Remove file from local uploads folder 
          fs.unlinkSync(locaFilePath)
          return {
              message: "Fail",
          };
      });
}

module.exports = {
  uploadCloudinary,
  uploadToCloudinary
}
