import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#core/base_controller'
import UserRole from '#models/user_role'
import { existsRule } from '#rules/exists'

export default class UserRolesController extends BaseController {
  /**
   * Display a list of resource
   */
 async index({ request }: HttpContext) {

    const params = request.all()

    let query: any = {
      table_and_join: 'from user_roles',
      field_show: [
        'id',
        'user_role_name',
        'user_role_description',
      ],
      field_search: ['user_role_name'],
      pagination: true,
    }

    const result = await this.query.generate(params, query, this.db)
    this.responseList('Users retrieved successfully', result)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        userRoleName: vine.string(),
        userRoleDescription: vine.string().optional(),
      })
    )
    const output = await validator.validate(payload)
    const data = await UserRole.create(output)

    this.response('User role created successfully', { item: data })
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await UserRole.findOrFail(params.id)

    this.response('User role retrieved successfully', { item: data })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        id: vine.number().use(existsRule({ table: 'user_roles', column: 'id' })),
        userRoleName: vine.string(),
        userRoleDescription: vine.string().optional(),
      })
    )
    const output = await validator.validate({ id: params.id, ...payload })
    const data = await UserRole.findOrFail(params.id)

    await data?.merge(output).save()

    this.response('User role updated successfully', { item: data })
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const data = await UserRole.findOrFail(params.id)
    await data?.delete()

    this.response('User role deleted successfully')
  }
}
