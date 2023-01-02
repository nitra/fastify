import fastify from 'fastify'
import fastifySensible from '@fastify/sensible'
import getLogger from '@nitra/bunyan/trace'
import { exit, env } from 'node:process'

const port = Number(env.PORT) || 8080

export const app = fastify({
  // logger: isDev,
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

  if (req.method !== 'OPTIONS') {
    req.log = getLogger(req)
    req.log.info('req.url: ', req.url)
  }

  done()
})

// Запускаємо сервер
export function listen() {
  app
    .listen({ port, host: '0.0.0.0' })
    .then(address => console.log(`🚀 Server ready at ${address}`))
    .catch(err => {
      console.error('Error starting server:', err)
      exit(1)
    })
}

function setHeaders(req, reply) {
  let host = env.ORIGIN || req.headers.origin || req.headers.referer
  if (!host) {
    host = 'localhost'
  }

  reply.header('Access-Control-Allow-Origin', host)
  reply.header('Access-Control-Allow-Credentials', 'true')
  reply.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*')
}
