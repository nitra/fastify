import fastifySensible from '@fastify/sensible'
import getLogger from '@nitra/pino/trace'
import fastify from 'fastify'
import { env, exit } from 'node:process'

const port = Number(env.PORT) || 8080

export const log = getLogger()

export const app = fastify({
  loggerInstance: getLogger(),
  bodyLimit: Number(env.BODY_LIMIT_MB || 1) * 1024 * 1024
  // http2: !!env.K_SERVICE // Запускаємо з http2 якщо в Cloud Run
})

// За проксі (Cloudflare, nginx тощо) можуть приходити запити з невідомим/порожнім Content-Type → 415.
// Дозволяємо будь-який тип: тіло не парситься, req.body лишається undefined.
app.addContentTypeParser('*', (req, payload, done) => {
  payload.resume()
  done(null, undefined)
})

app.register(fastifySensible) // для reply.badRequest(`Not found url: ${req.url} ...`)

// Опрацювання запитів OPTIONS
app.options('*', (_req, reply) => {
  // + setHeaders в preHandler
  reply.header('Access-Control-Max-Age', 86400)
  reply.header('Cache-Control', 'public, max-age=86400')
  reply.header('Vary', 'origin')

  reply.code(200).send()
})

app.get('/healthz', { logLevel: 'silent' }, () => {
  return { status: 'ok' }
})

app.addHook('preHandler', (req, reply, done) => {
  // Ручний cors, бо WildcardOrigin Not Allowed
  setHeaders(req, reply)

  // Додаємо до логеру traceId
  req.log = getLogger(req)

  done()
})

//
/**
 * Запускаємо сервер
 */
export function listen() {
  // Якщо ми запущені з нексусом
  // то додаємо в шлях в консолі '/graphql'
  const pluginMeta = app[Symbol.for('registered-plugin')]
  const path = pluginMeta.includes('@nitra/as-integrations-fastify') ? '/graphql' : ''

  app
    .listen({ port, host: '0.0.0.0' })
    .then(address => log.info(`🚀 Server ready at ${address + path}`))
    .catch(error => {
      log.error('Error starting server:', error)
      exit(1)
    })
}

/**
 *
 * @param {import('fastify').FastifyRequest} req req
 * @param {import('fastify').FastifyReply} reply reply
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
