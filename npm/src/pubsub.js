import logger from '@nitra/pino/fastify'
import fastify from 'fastify'
import { env, exit } from 'node:process'

const port = Number(env.PORT) || 8080

export const app = fastify({
  logger,
  http2: !!env.K_SERVICE // Запускаємо з http2 якщо в Cloud Run
})

// app.addHook('preHandler', (req, _, done) => {
//   req.log = getLogger(req)
//   req.log.info('req.url: ', req.url)

//   done()
// })

/**
 * Запускаємо сервер
 */
export function listen() {
  app
    .listen({ port, host: '0.0.0.0' })
    .then(address => console.log(`🚀 PubSub Consumer ready at ${address}`))
    .catch(error => {
      console.error('Error starting server:', error)
      exit(1)
    })
}
