require('dotenv').config({
    path: __dirname + '/.env'
})

const fileupload = require('express-fileupload')
const express = require('express')
const app = express()
app.use(express.json());
app.use(fileupload())

const {
    response,
} = require('./helpers/Common')
const router = require('./router')

// Allow cors
const cors = require('cors')
const corsOpts = {
    origin: ['*', "https://www.mobilku.biz", ],

    methods: [
        'GET',
        'POST',
        'PUT',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};
let allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "https://www.mobilku.biz");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCors);
app.use(cors(corsOpts));
app.use('/api', router)
const Database = require('./db')
const db = new Database()
db.connect()

app.use('/images', express.static('images'))
app.get('/', (req, resp) => {
    console.log(req.get('host'))
    return response(resp, 200, 'API is Active', {}, null)
})

app.listen(process.env.PORT || 3001, () => console.log('Server running on port 3001'), console.log('Url local http://localhost:3001'))