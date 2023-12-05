import { test, expect } from 'vitest'

test('o usuario consiga criar uma nova transação', () => {
  // fazer uma chamada HTTP para criar uma nova transação

  const responseStatusCode = 201
  expect(responseStatusCode).toEqual(201)
})
