require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
// Configuration 
cloudinary.config({
  cloud_name: "dj68bj5ql",
  api_key: "API KEY",
  api_secret: "SECRET"
});

// AWS Setting
const uuid = require('uuid4')
const AWS = require('aws-sdk')
const combinedEndpoint = `${"END_POINT_DIGITAL_OCEAN"}/assets/image/`
const endpointDigi = new AWS.Endpoint(combinedEndpoint)
const s3 = new AWS.S3({
  accessKeyId: 'ACCESS_KEY',
  secretAccessKey: 'SECRET_ACCESS_KEY',
  region: 'sgp1',
  endpoint: endpointDigi,
  s3BucketEndpoint: endpointDigi,
})


function uploadFile(file_data, file_mimetype, file_name) {
  return new Promise((done, reject) => {
    const mimetype = file_mimetype
    const ext = file_name.substring(file_name.lastIndexOf('.') + 1)
    let filename = `${uuid()}.${ext}`
    console.log(`Change file name from ${file_name} to ${filename}`)
    s3.upload(
      {
        Body: file_data,
        ACL: 'public-read',
        Bucket: 'media-ss',
        Key: filename,
        ContentType: mimetype,
      },
      (err, res) => {
        if (err) return reject(err)

        let url = res.Location
        if (!url.includes('http')) {
          url = `https://${url}`
        }

        console.log('Success Upload file')
        done(url)
      }
    )
  })
}


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
  uploadToCloudinary,
  uploadFile
}
