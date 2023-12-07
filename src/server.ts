import { env } from './env'
import { app } from './app'
// principais metodos GET, POST, PUT, PATCH, DELETE

app
  .listen({
    port: env.PORT,
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
