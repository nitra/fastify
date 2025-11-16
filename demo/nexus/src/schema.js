import nexus from 'nexus' // eslint-disable-line import/no-named-as-default
import * as types from './graphql-custom/index.js'

const { makeSchema, declarativeWrappingPlugin } = nexus

export const schema = makeSchema({
  types,
  plugins: [declarativeWrappingPlugin()],
  outputs: {}
})
