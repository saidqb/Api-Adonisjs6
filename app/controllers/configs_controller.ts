import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#core/base_controller'
import Config from '#models/config'

export default class ConfigsController extends BaseController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
     const params = request.all()

    let query: any = {
      table_and_join: 'from posts',
      field_show: [
        'id',
        'key',
        'value',
        'is_json',
      ],
      field_search: ['key'],
      pagination: true,
    }

    const result = await this.query.generate(params, query, this.db)
    this.responseList('Config retrieved successfully', result)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        key: vine.string(),
        value: vine.string(),
        is_json: vine.number().optional(),
      })
    )
    const output = await validator.validate(payload)
    const data = await Config.create(output)

    this.response('Config created successfully', {item:data})
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await Config.findOrFail(params.key)

    this.response('Config retrieved successfully', {item:data})
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        key: vine.string(),
        value: vine.string(),
        is_json: vine.number().optional(),
      })
    )
    const output = await validator.validate({ key: params.key, ...payload })
    const data = await Config.findOrFail(params.key)

    await data?.merge(output).save()

    this.response('Config updated successfully', {item:data})
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const data = await Config.findOrFail(params.key)
    await data?.delete()

    this.response('Config deleted successfully')
  }
}
