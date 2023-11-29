import fastify from 'fastify'
import { env } from './env'
import { tranctionsRoutes } from './routes/transactions'

const app = fastify()

app.register(tranctionsRoutes)

// principais metodos GET, POST, PUT, PATCH, DELETE

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
