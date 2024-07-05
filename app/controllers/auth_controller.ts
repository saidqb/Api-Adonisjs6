import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { cuid } from '@adonisjs/core/helpers'
import BaseController from '#core/base_controller'
import User from '#models/user'

export default class AuthController extends BaseController {

  async login({ request }: HttpContext) {
    const { email, password, identity } = request.only(['email', 'password', 'identity'])

    try {
      // check user
      const user = await User.findBy('email', email)
      if (!user) {
        return this.responseError('Invalid credentials', 412)
      }

      // check password
      const login = await hash.verify(user.password, password)
      if (!login) {
        return this.responseError('Invalid credentials', 412)
      }

      // create token
      const token = await User.accessTokens.create(user, ['*'], {
        name: identity ?? cuid(),
      })


      this.response('Login successfully', { item: user, user_token: token })
    } catch (error: any) {
      this.responseError('Invalid credentials', 400)
    }
  }

}
