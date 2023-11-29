import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

// console.log(process.env) //verifica o valor das variaveis de ambiente

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
