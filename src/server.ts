import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

// principais metodos GET, POST, PUT, PATCH, DELETE

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*') // sqlite_schema é criada automaticamente

  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
