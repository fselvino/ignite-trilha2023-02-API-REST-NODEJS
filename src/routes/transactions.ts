import { randomUUID } from 'crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

// Cookies <-> Formas de manter constexto entre requisições

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

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      replay.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days em milisegundos
      })
    }

    // realiza a inserção dos dados vindos da aplicação
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })
    return replay.status(201).send()
  })

  // /transactions
  app.get('/', async () => {
    const transactions = await knex('transactions')
      // .whe('amount', 1000) // onde amount = 100 - primeira coluna campo sengundo valor
      .select()

    // prefira retornar um objeto
    return {
      transactions,
    }
  })

  // Lista somente uma transação com id valido
  // //localhost:3333/transactions/uuid
  app.get('/:id', async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first()

    return {
      transaction,
    }
  })

  // retorna um somatorio da coluna amount
  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' }) // é preciso nomear a coluna para que não retorne sun{amount}
      .first()
    return { summary }
  })
}
