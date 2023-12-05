import { it, beforeAll, afterAll, describe, expect } from 'vitest'
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

  // Deve ser capaz de criar uma nova transação
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

  /**
   * obs -> it.skip - quer dizer que quando rodar os teste esse teste será pulado
   * obs -> it.todo - quer dizer que devo lembrar para fazer esse teste no futuro
   */

  // Deve ser possível listar todas transações
  it('should be able to list all transactions', async () => {
    const createTransacationResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
    const cookies = createTransacationResponse.get('Set-Cookie')
    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // lista o corpo do retorno dos test
    // console.log(listTransactionsResponse.body)

    //
    expect(listTransactionsResponse.body.transactions).toEqual([
      // expero um objeto contendo
      expect.objectContaining({
        // id: expect.any(String), // espero que meu id seja qualquer string
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })
})
