import { queryField } from 'nexus'

export const nxrDB = queryField('nxpTest', {
  list: true,
  type: 'String',

  /**
   * Список
   * @param {*} _ 1
   * @param __ 2
   * @param ctx 3
   * @returns {Promise<Array>} r
   */
  async resolve(_, __, ctx) {
    try {
      ctx.log.info('nxpTest')
    } catch (error) {
      ctx.log.error(error)
    }

    return ['1', '2']
  }
})
