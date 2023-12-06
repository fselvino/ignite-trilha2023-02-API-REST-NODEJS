import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process' // permite execultar qualquer comando do termimal
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

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
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
    // console.log(response.body)
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

  // lista uma transaçao especifica
  it('should be able to get a specific transactions', async () => {
    const createTransacationResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
    // retorna o cookie criado no momento da criaçao da transaçao
    const cookies = createTransacationResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies) // passa o cookie criado
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    // console.log(transactionId)

    const getTransacionReponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies) // passa o cookie criado
      .expect(200)

    // lista o corpo do retorno dos test
    // console.log(listTransactionsResponse.body)

    expect(getTransacionReponse.body.transaction).toEqual(
      // expero um objeto contendo
      expect.objectContaining({
        // id: expect.any(String), // espero que meu id seja qualquer string
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  // lista o resumo das transações
  it('should be able to get the summary', async () => {
    const createTransacationResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })
    const cookies = createTransacationResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 3000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    // lista o corpo do retorno dos test
    // console.log(listTransactionsResponse.body)

    //
    expect(summaryResponse.body.summary).toEqual({
      amount: 2000,
    })
  })
})
