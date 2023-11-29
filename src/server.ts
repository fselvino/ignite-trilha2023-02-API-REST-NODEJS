import fastify from 'fastify'
import { env } from './env'
import { tranctionsRoutes } from './routes/transactions'

const app = fastify()

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
