import { FastifyRequest, FastifyReply } from 'fastify'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // recupera o cookie criado
  const sessionId = request.cookies.sessionId

  // Verifica se o cookie existe, caso negativo retorna mensagem de erro
  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }
}
