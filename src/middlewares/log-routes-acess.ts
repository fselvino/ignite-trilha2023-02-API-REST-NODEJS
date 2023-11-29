import { FastifyRequest } from 'fastify'

export async function logSessionAcess(request: FastifyRequest) {
  console.log(`[${request.method}] ${request.url}`)
}
