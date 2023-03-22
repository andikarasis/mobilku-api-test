const ApiService = require('../service/ApiServices')
const {
  uploadFile
} = require('../helpers/Upload')
const sharp = require("sharp");
const fs = require('fs');
var path = require('path')
const {
  response,
  makeid
} = require('../helpers/Common')
let dir = __dirname
let dirImages = dir.replace("controllers", "") + "images/"

const insertData = async function (req, res) {
  try {
    const file = req.files && req.files.image
    let ext = path.extname(file.name)
    let idImage = makeid(10) + ext
    let hostUrl = req.protocol + '://' + req.hostname + "/"
    fs.writeFile(idImage, file.data, async (err) => {
      if (err)
        console.log(err);
      else {
        let body = req.body
        let image1 = await resizeImage(idImage, 500, file.mimetype, file.name)
        let image2 = await resizeImage(idImage, 1000, file.mimetype, file.name)
        body.image1 = image1
        body.image2 = image2
        // Remove file from local uploads folder 
        fs.unlinkSync(idImage)
        const service = new ApiService(null, 'users', null, [body])
        service.insertData()
      }
    });
    console.log('success inserting data');

    return response(res, 200, 'success inserting data', {})
  } catch (err) {
    console.log('Error while insert data', err)
    return response(res, 500, 'Error while insert data', {}, null)
  }
}
const getDataUser = async function (req, res) {
  try {
    let query = req.query
    let filters = query
    console.log("🚀 ~ file: ApiController.js:48 ~ getDataUser ~ filters:", filters)
    const service = new ApiService(null, 'users', filters, null)
    let [status, row, rowCount] = await service.list()
    console.log('success get data');
    if (filters.mode == "exact" || filters.mode == "contains") {
      let data = row[0]
      return response(res, status, 'success', data)
    } else {
      let data = row
      return response(res, status, 'success', data)
    }

  } catch (err) {
    console.log('Error while get user', err)
    return response(res, 500, 'Error while get user', {}, null)
  }
}

async function updateDataUser(req, resp) {
  try {
    const file = req.files && req.files.image
    let query = req.query
    let table_name = 'users'
    let body = req.body
    let ext = path.extname(file.name)
    let idImage = makeid(10) + ext
    let hostUrl = req.protocol + '://' + req.hostname + "/"
    fs.writeFile(idImage, file.data, async (err) => {
      if (err)
        console.log(err);
      else {
        let image1 = await resizeImage(idImage, 500, file.mimetype, file.name)
        let image2 = await resizeImage(idImage, 1000, file.mimetype, file.name)
        body.image1 = image1
        body.image2 = image2
        // Remove file from local uploads folder 
        fs.unlinkSync(idImage)
        const service = new ApiService(null, table_name, query, body)
        await service.update()
      }
    });
    console.log('success updating data');

    return response(resp, 200, 'sucess updating data')
  } catch (err) {
    console.log('Error while updating data', err)
    return response(resp, 500, 'Error while updating data', {}, null)
  }
}


async function resizeImage(file, pixel, mime, name) {
  console.log("🚀 ~ file: ApiController.js:94 ~ resizeImage ~ name:", name)
  console.log("🚀 ~ file: ApiController.js:94 ~ resizeImage ~ mime:", mime)
  let output = dirImages + pixel + "px_" + file
  try {
    let datas = await sharp(file).resize({ width: pixel, height: pixel }).toBuffer();
    // Upload to S3 Storage
    const urls = await uploadFile(datas, mime, name)
    // await sharp(file)
    //   .resize({
    //     width: pixel,
    //     height: pixel
    //   })
    //   .toBuffer(function (err, data) {
    //     console.log("data", data);
    //   })
    // .toFile(output);
    // let url = "images/" + pixel + "px_" + file
    return urls
  } catch (error) {
    console.log(error);
  }
}


async function UploadFile(req, resp) {
  try {
    const file = req.files && req.files.file
    console.log("🚀 ~ file: ApiController.js:111 ~ UploadFile ~ file:", file)
    if (!file) return response(resp, 400, 'file not found!')

    const url = await uploadFile(file.data, file.mimetype, file.name)
    return response(resp, 200, 'success', {
      url: url,
    })
  } catch (err) {
    console.log('Error while uploading file', err)
    return response(resp, 500, 'Error while uploading file', {}, err.message)
  }
}

module.exports = {
  insertData,
  getDataUser,
  updateDataUser,
  UploadFile
}