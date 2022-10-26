import { app, listen } from '@nitra/fastify'
import * as a from './actions/index.js'

// Обрабатываем только POST
app.post('/call', async (req, reply) => {
  const log = req.log
  req.log.info('req.url: ', req.url)

  if (req.body.error) {
    reply.unauthorized()
    return
  }

  // log.info(req.body)

  // Код по умолчанию
  let code = 200
  const resp = {}

  try {
    switch (req.url) {
      case '/events/call': {
        log.info('/call')
        break
      }
      case '/events/summary': {
        log.info('/summary')
        break
      }
      case '/events/record/added': {
        await a.added(req)
        break
      }
      case '/events/recording': {
        log.info('/recording NA')
        break
      }
      default: {
        log.info('default: ', req.url)
        // reply.badRequest(`Not found url: ${req.url} ...`)
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

// app.listen({ port, host: '0.0.0.0' })

// Запускаем сервер
listen()
