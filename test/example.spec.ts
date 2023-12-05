import { test, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

// aguardar que o app esteja pronto
beforeAll(async () => {
  await app.ready()
})

// depois que os teste execultarem seja fechado a aplicaçao
// fechar a aplicação é basicamente retirar a plicação da memória
afterAll(async () => {
  await app.close()
})

test('o usuario consiga criar uma nova transação', async () => {
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })
    .expect(201)
})
