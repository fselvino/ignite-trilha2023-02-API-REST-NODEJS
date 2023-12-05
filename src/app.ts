import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { tranctionsRoutes } from './routes/transactions'
import { logSessionAcess } from './middlewares/log-routes-acess'

export const app = fastify()

app.addHook('preHandler', logSessionAcess) // hook global

// A injeção de cookies deve ser feita bem no inicio antes da injeção das rotas
app.register(cookie)

// injeção de dependencia com prefixo transactions
app.register(tranctionsRoutes, {
  prefix: 'transactions',
})
