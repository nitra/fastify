import { app, listen } from '@nitra/fastify'

// Обрабатываем только POST
app.post('/*', async (req, reply) => {
  const log = req.log

  // Код по умолчанию
  let code = 200
  const resp = {}

  try {
    switch (req.url) {
      case '/test': {
        log.info('/test')
        break
      }
      default: {
        log.info('default: ', req.url)
        return
      }
    }
  } catch (err) {
    req.log.error(err)
    resp.error = 'Ошибка...'
    code = 400
    log.error(err)
  } finally {
    reply.code(code).send(resp)
  }
})

// Запускаем сервер
listen()
