import fastify from 'fastify'
import getLogger from '@nitra/bunyan/trace'
import { exit, env } from 'node:process'

const port = Number(env.PORT) || 8080

export const app = fastify({
  http2: !!env.K_SERVICE // Запускаємо з http2 якщо в Cloud Run
})

app.addHook('preHandler', (req, _, done) => {
  req.log = getLogger(req)
  req.log.info('req.url: ', req.url)

  done()
})

// Запускаємо сервер
export function listen() {
  app
    .listen({ port, host: '0.0.0.0' })
    .then(address => console.log(`🚀 PubSub Consumer ready at ${address}`))
    .catch(err => {
      console.error('Error starting server:', err)
      exit(1)
    })
}
