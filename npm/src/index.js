import fastify from 'fastify'
import { isDev } from '@nitra/isenv'

const port = Number(process.env.PORT) || 8080

export const app = fastify({
  logger: isDev,
  http2: !!process.env.K_SERVICE // Запускаем в http2 если находимся в контейнере
})

// Обрабатываем только OPTIONS
app.options('/*', async (req, reply) => {
  // Ручний cors, бо WildcardOrigin Not Allowed
  setHeaders(req, reply)

  reply.header('Access-Control-Max-Age', 86400)
  reply.header('Cache-Control', 'public, max-age=86400')
  reply.header('Vary', 'origin')

  reply.code(200).send()
})

// Запускаем сервер
app.listen({ port, host: '0.0.0.0' })

function setHeaders(req, reply) {
  let host = req.headers.origin || req.headers.referer
  if (!host) {
    host = 'localhost'
  }

  reply.header('Access-Control-Allow-Origin', host)
  reply.header('Access-Control-Allow-Credentials', 'true')
  reply.header('Access-Control-Allow-Headers', 'Content-Type')
}
