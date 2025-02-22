import { ApolloServer } from '@apollo/server'
import fastifyApollo, { fastifyApolloDrainPlugin } from '@nitra/as-integrations-fastify'
import { app, listen } from '@nitra/fastify'
import context from './context.js'
import { schema } from './schema.js'

const apollo = new ApolloServer({
  schema,
  introspection: true,
  plugins: [fastifyApolloDrainPlugin(app)]
})

await apollo.start()
await app.register(fastifyApollo(apollo), { context })

// Запускаємо сервер
listen()
