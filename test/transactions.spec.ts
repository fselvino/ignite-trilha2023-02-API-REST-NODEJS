import { it, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

// Metodo que descreve o que o test irá fazer
describe('Transactions routes', () => {
  // aguardar que o app esteja pronto
  beforeAll(async () => {
    await app.ready()
  })

  // depois que os teste execultarem seja fechado a aplicaçao
  // fechar a aplicação é basicamente retirar a plicação da memória
  afterAll(async () => {
    await app.close()
  })

  // ser capaz de criar uma nova transação
  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })
})
