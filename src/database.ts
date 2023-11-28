import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'

//console.log(process.env) //verifica o valor das variaveis de ambiente

//if temporario somente para não dar erro
if(!process.env.DATABASE_URL){
  throw new Error('DATABASE_URL env not found.')
}

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
