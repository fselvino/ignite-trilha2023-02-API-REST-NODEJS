import fastify from 'fastify'
import { randomUUID } from 'crypto'
import { knex } from './database'

const app = fastify()

// principais metodos GET, POST, PUT, PATCH, DELETE

app.get('/hello', async () => {
  const transaction = await knex('transactions')
    .insert({
      id: randomUUID(),
      title: 'Transação de teste',
      amount: 1000,
    })
    .returning('*')
  return transaction // retorna todas informações inseridas
})
app.get('/transactions', async () => {
  const transactions = await knex('transactions')
    .where('amount', 1000) // onde amount = 100 - primeira coluna campo sengundo valor
    .select('*')
  return transactions
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
