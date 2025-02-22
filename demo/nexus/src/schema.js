import nexus from 'nexus'
import * as types from './graphql-custom/index.js'
const { makeSchema, declarativeWrappingPlugin } = nexus

export const schema = makeSchema({
  types,
  plugins: [declarativeWrappingPlugin()],
  outputs: {}
})
