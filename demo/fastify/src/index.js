import { app, listen } from '@nitra/fastify'

// Опрацьовуємо тільки POST
app.post('/*', async (req, reply) => {
  // Код за замовчуванням
  let code = 200
  const resp = {}

  try {
    switch (req.url) {
      case '/test': {
        req.log.info('/test')
        break
      }
      default: {
        req.log.info('default: ', req.url)
      }
    }
  } catch (error) {
    req.log.error(error)
    resp.error = 'Помилка...'
    code = 400
  } finally {
    reply.code(code).send(resp)
  }
})

// Запускаємо сервер
listen()
