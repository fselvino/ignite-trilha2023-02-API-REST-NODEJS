import { config } from 'dotenv'
import { z } from 'zod'

// console.log(process.env.NODE_ENV)

// quanto uso uma ferramente de teste ele preenche a variavel de ambiente automaticamente com test
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' }) // caso seja a variavel de ambiente a ser utilizada passa ser .env.test
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('⚠️  -  Invalida environment variable', _env.error.format())

  throw new Error('Ivalid environment variables')
}

export const env = _env.data
