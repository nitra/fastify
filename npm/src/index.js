import fastifySensible from '@fastify/sensible'
import loggerInstance from '@nitra/pino'
import fastify from 'fastify'
import { env, exit } from 'node:process'

const port = Number(env.PORT) || 8080

export const app = fastify({
  loggerInstance,
  bodyLimit: (env.BODY_LIMIT_MB || 1) * 1024 * 1024,
  http2: !!env.K_SERVICE // Запускаємо з http2 якщо в Cloud Run
})

app.register(fastifySensible) // для reply.badRequest(`Not found url: ${req.url} ...`)

// Опрацювання запитів OPTIONS
app.options('/*', async (req, reply) => {
  // + setHeaders в preHandler
  reply.header('Access-Control-Max-Age', 86400)
  reply.header('Cache-Control', 'public, max-age=86400')
  reply.header('Vary', 'origin')

  reply.code(200).send()
})

app.addHook('preHandler', (req, reply, done) => {
  // Ручний cors, бо WildcardOrigin Not Allowed
  setHeaders(req, reply)

  done()
})

//
/**
 * Запускаємо сервер
 */
export function listen() {
  app
    .listen({ port, host: '0.0.0.0' })
    .then(address => console.log(`🚀 Server ready at ${address}`))
    .catch(error => {
      console.error('Error starting server:', error)
      exit(1)
    })
}

/**
 *
 * @param req
 * @param reply
 */
function setHeaders(req, reply) {
  let host = env.ORIGIN || req.headers.origin || req.headers.referer
  if (!host) {
    host = 'localhost'
  }

  reply.header('Access-Control-Allow-Origin', host)
  reply.header('Access-Control-Allow-Credentials', 'true')
  reply.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*')
}
