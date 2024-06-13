import { randomUUID } from 'crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// Cookies <-> Formas de manter constexto entre requisições

/**
 * Tipos de testes automatizados - são formas de manter a confiança no momento de dar manuteção no codigo
 * Unitários: unidade da sua aplicação
 * Integração: comunicação entre duas ou mais unidades
 * e2e - ponta a ponta: simulam um usuário operando nossa aplicação
 *
 * front-end: abre a página de login, digite o texto diego@rocketseat.com.br no compo com ID email, clique no botão
 * back-end: chamadas HTTP`, webSockets
 *
 * Pirãmide de teste: E2E (não dependem de nenhuma tecnologia, não dependem de arquiterura)
 *
 *
 */

export async function tranctionsRoutes(app: FastifyInstance) {
  // Rota para realizar a criação de uma transação
  app.post('/', async (request, reply) => {
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

    // retorna o cookie do usuario da aplicaçao
    let sessionId = request.cookies.sessionId

    // testa o cookie se nao existir cria um novo
    if (!sessionId) {
      sessionId = randomUUID()

      // passa o cookie criado para aplicação
      reply.cookie('sessionId', sessionId, {
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
    return reply.status(201).send()
  })

  // /transactions
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] }, // Verifica por meio de middleware se o cookie existe e é valido na consulta
    async (request) => {
      const { sessionId } = request.cookies
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      // prefira retornar um objeto
      return {
        transactions,
      }
    },
  )

  // Lista somente uma transação com id valido
  // //localhost:3333/transactions/uuid
  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionParamsSchema.parse(request.params)
    const { sessionId } = request.cookies

    const transaction = await knex('transactions')
      .where({
        id,
        session_id: sessionId,
      })
      .first()

    return {
      transaction,
    }
  })

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getTransactionParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .del()

      return {
        transaction,
      }
    },
  )

  // retorna um somatorio da coluna amount
  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' }) // é preciso nomear a coluna para que não retorne sun{amount}
        .first()
      return { summary }
    },
  )
}
