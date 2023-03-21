const moment = require('moment')

function response(resp, code, message, data, error) {
  resp.status(code).send({
    code: code,
    message: message || '',
    data: data || {},
    error: error || null,
  })
}

function generateInsertQuery(data, table_name) {
  const builder = []
  const keys = Object.keys(data[0])

  builder.push(`INSERT INTO ${table_name}(${keys}) VALUES `)

  const values = []
  data.forEach((item) => {
    const list_value = []
    keys.forEach((key) => {
      if (item[key]) list_value.push(`'${item[key].toString().replace(/'/g, "''")}'`)
      else list_value.push(`null`)
    })
    values.push(`(${list_value.join(', ')})`)
  })

  builder.push(values.join(', '))
  const query = `${builder.join(' ')} RETURNING *`
  console.log('generate insert query  ==> ', query.substring(0, 300))

  return query
}

function generateUpdateQuery(data, table_name, field, value) {
  if (!field && !value) {
    console.log('field and value is empty')
    throw new Error('field and value is empty')
  }

  const builder = []
  const setter = []
  const keys = Object.keys(data)
  builder.push(`UPDATE ${table_name} SET `)
  keys.forEach((key) => {
    setter.push(`${key} = '${data[key]}'`)
  })
  setter.push(`updated_at = NOW()`)

  builder.push(setter.join(', '))
  builder.push(`WHERE ${field} = '${value}'`)
  const query = builder.join(' ')
  console.log('generate update query  ==> ', query)

  return query
}

function generateGetQuery(table_name, filters) {
  const builder = [`SELECT * FROM ${table_name}`]
  if (filters.field && filters.value && filters.mode) {
    if (filters.mode === 'contains') builder.push(`WHERE ${filters.field} ILIKE '%${filters.value}%'`)
    else builder.push(`WHERE ${filters.field} = '${filters.value}'`)
  }
  builder.push('ORDER BY id ASC')

  const query = builder.join(' ')
  console.log('generate get query  ==> ', query)
  return query
}

function makeid(length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

module.exports = {
  response,
  makeid,
  generateInsertQuery,
  generateUpdateQuery,
  generateGetQuery,
}