import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { tranctionsRoutes } from './routes/transactions'

const app = fastify()

// A injeção de cookies deve ser feita bem no inicio antes da injeção das rotas
app.register(cookie)

// injeção de dependencia com prefixo transactions
app.register(tranctionsRoutes, {
  prefix: 'transactions',
})

// principais metodos GET, POST, PUT, PATCH, DELETE

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
