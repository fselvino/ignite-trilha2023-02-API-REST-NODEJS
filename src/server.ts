import fastify from 'fastify'

const app = fastify()

// principais metodos GET, POST, PUT, PATCH, DELETE

app.get('/hello', () => {
  return 'Hello World '
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
