require('dotenv').config()
const {
    Pool
} = require('pg')

// const host = process.env.DB_HOST || ''
// const user = process.env.DB_USER || ''
// const pass = process.env.DB_PASS || ''
// const endpoint = process.env.DB_PORT || ''
// const name = process.env.DB_NAME || ''
// const ssl = process.env.DB_SSL || 'true'

const internal_config = {
    connectionString: "CONNECTION_STRING_DB"
}
// const internal_config = {
//     host: host,
//     user: user,
//     password: pass,
//     port: port,
//     database: name,
// }

if (ssl === 'true') internal_config.ssl = {
    rejectUnauthorized: false
}
const client = new Pool(internal_config)
client.connect().then(() => console.log('Success create DB connection')).catch((err) => console.log('Error while connecting DB', err))

class Database {
    constructor(configuration, type) {
        this.configuration = configuration || {}

        this.type = type
        this.db = null
        // this.client = new Pool(config)
    }

    async connect() {
        // const db = await this.client.connect()
        // this.db = db
    }

    async query(query, arr = []) {
        let results = []
        try {
            return await client.query(query, arr)
        } catch (err) {
            console.log('Error while querying', err)
            throw new Error(err)
        }
    }

    release() {
        // this.db.release()
        // this.client.removeAllListeners()
        // this.client.end()
    }
}

module.exports = Database