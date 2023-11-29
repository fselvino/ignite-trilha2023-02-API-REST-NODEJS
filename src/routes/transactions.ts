import { randomUUID } from 'crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'

export async function tranctionsRoutes(app: FastifyInstance) {
  app.post('/hello', async () => {
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
}
