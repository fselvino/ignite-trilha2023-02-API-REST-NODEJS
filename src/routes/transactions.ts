import { randomUUID } from 'crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function tranctionsRoutes(app: FastifyInstance) {
  // /transactions
  app.post('/', async (request, replay) => {
    // definição de schema para criar uma transação definindo o tipo dos dados vindo da aplicação
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    // realiza a validação dos dados vindos da aplicação conforme schema estabelecido acima
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    ) // validando os dados da requisição para ver se batem com o Schema defido

    // realiza a inserção dos dados vindos da aplicação
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })
    return replay.status(201).send()
  })

  // /transactions
  app.get('/', async () => {
    const transactions = await knex('transactions')
      // .whe('amount', 1000) // onde amount = 100 - primeira coluna campo sengundo valor
      .select('*')
    return transactions
  })
}
