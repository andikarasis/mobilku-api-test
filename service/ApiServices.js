const Database = require('../db')
const uuid4 = require('uuid4')
const { generateInsertQuery, generateUpdateQuery, generateGetQuery, makeid } = require('../helpers/Common')

class ApiService {
  constructor(user, table_name, filters, body) {
    this.user = user || {}
    this.filters = filters
    this.body = body
    this.table_name = table_name
  }

  async list() {
    const db = new Database()
    await db.connect()
    let query = generateGetQuery(this.table_name, this.filters)
    const { rows, rowCount } = await db.query(query)
    db.release()
    return [200, rows, rowCount]
  }

  async update() {
    const db = new Database()
    await db.connect()
    let query = generateUpdateQuery(this.body, this.table_name, this.filters.field, this.filters.value)
    await db.query(query)
    db.release()
    return [200, `success update data for ${this.filters.field}: ${this.filters.value}`]
  }

  async insertData() {
    const db = new Database()
    await db.connect()
    const unique_id = uuid4()
    this.body.forEach(el => {
      el.unique_id = unique_id
    });
    const query2 = generateInsertQuery(this.body, this.table_name)
    await db.query(query2)
    db.release()
    return [200, 'success']
  }
}

module.exports = ApiService
