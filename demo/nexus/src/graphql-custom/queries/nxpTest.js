import { queryField } from 'nexus'

/**
 * @typedef {object} GraphQLContext
 * @property {import('pino').Logger} log - логер Pino для запису подій
 */

export const nxrDB = queryField('nxpTest', {
  list: true,
  type: 'String',

  /**
   * Список
   * @param {unknown} _ 1
   * @param {Record<string, unknown>} __ 2
   * @param {GraphQLContext} ctx 3
   * @returns {string[]} r
   */
  resolve(_, __, ctx) {
    try {
      ctx.log.info('nxpTest')
    } catch (error) {
      ctx.log.error(error)
    }

    return ['1', '2']
  }
})
