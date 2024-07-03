import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import * as configApi from '#config/api'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  apikey = configApi.apiKey

  async handle(
    ctx: HttpContext,
    next: NextFn,
  ) {

    if(ctx.request.request!.headers!['api-key'] !== this.apikey) {
      return ctx.response.status(401).send({
        status: 401,
        success: false,
        error_code: 1,
        message: 'Unauthorized access',
        data: {},
      })
    }

    return next()
  }
}
