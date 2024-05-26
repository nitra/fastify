import { app, listen } from '@nitra/fastify'

// Обрабатываем только POST
app.post('/*', async (req, reply) => {
  // Код по умолчанию
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
    resp.error = 'Ошибка...'
    code = 400
  } finally {
    reply.code(code).send(resp)
  }
})

// Запускаем сервер
listen()
