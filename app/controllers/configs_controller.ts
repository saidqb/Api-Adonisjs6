import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#core/base_controller'
import Config from '#models/config'

export default class ConfigsController extends BaseController {
  /**
   * Display a list of resource
   */
  async index() {
    const data = await Config.all()

    this.response('Config retrieved successfully', { items: data })
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
