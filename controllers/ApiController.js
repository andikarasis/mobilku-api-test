const ApiService = require('../service/ApiServices')
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
        let image1 = await resizeImage(idImage, 500)
        let image2 = await resizeImage(idImage, 1000)
        body.image1 = hostUrl + image1
        body.image2 = hostUrl + image2
        // Remove file from local uploads folder 
        fs.unlinkSync(idImage)
        const service = new ApiService(null, 'users', null, [body])
        service.insertData()
      }
    });

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
    const service = new ApiService(null, 'users', filters, null)
    let [status, row, rowCount] = await service.list()
    let data = row[0]

    return response(res, status, 'success', data)
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
        let image1 = await resizeImage(idImage, 500)
        let image2 = await resizeImage(idImage, 1000)
        body.image1 = hostUrl + image1
        body.image2 = hostUrl + image2
        // Remove file from local uploads folder 
        fs.unlinkSync(idImage)
        const service = new ApiService(null, table_name, query, body)
        await service.update()
      }
    });

    return response(resp, 200, 'sucess updating data')
  } catch (err) {
    console.log('Error while updating data', err)
    return response(resp, 500, 'Error while updating data', {}, null)
  }
}


async function resizeImage(file, pixel) {
  let output = dirImages + pixel + "px_" + file
  try {
    await sharp(file)
      .resize({
        width: pixel,
        height: pixel
      })
      .toFile(output);
    let url = "images/" + pixel + "px_" + file
    return url
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  insertData,
  getDataUser,
  updateDataUser
}