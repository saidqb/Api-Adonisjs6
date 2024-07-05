import { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import vine from '@vinejs/vine'
import BaseController from '#core/base_controller'
import User from '#models/user'
import { uniqueRule } from '#rules/unique'

export default class AccountController extends BaseController {

  async show({ auth }: HttpContext) {
    const user = await auth.authenticate()

    this.response('User retrieved successfully', { item: user })
  }

  async update({ auth, request }: HttpContext) {
    const user = await auth.authenticate()
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        password: vine.string().minLength(8).maxLength(32).confirmed().optional(),
        name: vine.string().optional(),
        avatar_url: vine.string().optional(),
        email: vine
          .string()
          .email()
          .use(uniqueRule({ table: 'users', column: 'email', except: user.id, exceptColumn: 'id' }))
          .optional(),
      })
    )
    const output = await validator.validate(payload)

    await user?.merge(output).save()

    this.response('User updated successfully', user)
  }

  async refresh_token({ auth }: HttpContext) {
    const user = await auth.authenticate()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    // create new token
    const token = await User.accessTokens.create(user, ['*'], {
      name: cuid(),
    })

    this.response('Refresh token successfully', { item: user, user_token: token })
  }

  async logout({ auth }: HttpContext) {
    const user = await auth.authenticate()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    this.response('Logout successfully')
  }
}
