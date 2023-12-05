import { env } from './env'
import { app } from './app'
// principais metodos GET, POST, PUT, PATCH, DELETE

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
