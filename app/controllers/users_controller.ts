import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#core/base_controller'
import User from '#models/user'
import { uniqueRule } from '#rules/unique'
import { existsRule } from '#rules/exists'

export default class UsersController extends BaseController {
  /**
   * Display a list of resource
   */
  async index() {
    const data = await User.all()

    this.response('Users retrieved successfully', { items: data })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        user_status_id: vine.number().use(existsRule({ table: 'user_statuses', column: 'id' })),
        user_role_id: vine.number().use(existsRule({ table: 'user_roles', column: 'id' })),
        username: vine.string().use(
          uniqueRule({
            table: 'users',
            column: 'username',
          })
        ),
        password: vine
          .string()
          .minLength(8)
          .maxLength(32)
          .confirmed({
            confirmationField: 'passwordConfirmation',
          })
          .optional(),
        name: vine.string(),
        email: vine
          .string()
          .email()
          .use(uniqueRule({ table: 'users', column: 'email' })),
      })
    )
    const output = await validator.validate(payload)



    const data = await User.create(output)

    this.response('User created successfully', { item: data })
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await User.findOrFail(params.id)
    await data.load('user_role')
    await data.load('user_status')
    await data.load('posts')

    this.response('User retrieved successfully', { item: data })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        id: vine.number().use(existsRule({ table: 'users', column: 'id' })),
        user_status_id: vine.number().use(existsRule({ table: 'user_statuses', column: 'id' })),
        user_role_id: vine.number().use(existsRule({ table: 'user_roles', column: 'id' })),
        username: vine.string().use(
          uniqueRule({
            table: 'users',
            column: 'username',
            except: params.id,
            exceptColumn: 'id',
          })
        ),
        password: vine
          .string()
          .minLength(8)
          .maxLength(32)
          .confirmed({
            confirmationField: 'passwordConfirmation',
          })
          .optional(),
        name: vine.string(),
        email: vine
          .string()
          .email()
          .use(
            uniqueRule({ table: 'users', column: 'email', except: params.id, exceptColumn: 'id' })
          ),
      })
    )
    const output = await validator.validate({ id: params.id, ...payload })
    const data = await User.findOrFail(params.id)
    await data?.merge(output).save()

    this.response('User updated successfully', { item: data })
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const data = await User.findOrFail(params.id)
    if(data.id === 1){
      return this.responseError('Cannot delete super admin', 412)
    }
    await data?.delete()

    this.response('User deleted successfully')
  }
}
