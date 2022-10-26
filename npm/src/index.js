import fastify from 'fastify'
// import { isDev } from '@nitra/isenv'
import fastifySensible from '@fastify/sensible'
import getLogger from '@nitra/bunyan/trace'

const port = Number(process.env.PORT) || 8080

export const app = fastify({
  // logger: isDev,
  http2: !!process.env.K_SERVICE // Запускаємо з http2 якщо в Cloud Run
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

  req.log = getLogger(req)
  done()
})

// Запускаємо сервер
export async function listen() {
  return app.listen({ port, host: '0.0.0.0' })
}

function setHeaders(req, reply) {
  let host = req.headers.origin || req.headers.referer
  if (!host) {
    host = 'localhost'
  }

  reply.header('Access-Control-Allow-Origin', host)
  reply.header('Access-Control-Allow-Credentials', 'true')
  reply.header('Access-Control-Allow-Headers', 'Content-Type')
}
