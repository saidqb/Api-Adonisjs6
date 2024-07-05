import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@adonisjs/core'
import { errors as AuthErrors } from '@adonisjs/auth'
import { errors as VineErrors } from '@vinejs/vine'
import { errors as BouncerErrors } from '@adonisjs/bouncer'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    console.log('Error', error)

    if (error instanceof errors.E_ROUTE_NOT_FOUND) {
      return ctx.response.status(error.status).send({
        status: 404,
        success: false,
        error_code: 0,
        message: 'Route not found',
        data: {},
      })
    }

    if (error instanceof AuthErrors.E_UNAUTHORIZED_ACCESS) {
      return ctx.response.status(error.status).send({
        status: 401,
        success: false,
        error_code: 2,
        message: 'Unauthorized access',
        data: {},
      })
    }

    if (error instanceof BouncerErrors.E_AUTHORIZATION_FAILURE) {
      return ctx.response.status(error.status).send({
        status: 403,
        success: false,
        error_code: 3,
        message: 'Unauthorized action',
        data: {},
      })
    }

    if (error instanceof VineErrors.E_VALIDATION_ERROR) {
      return ctx.response.status(error.status).send({
        status: 422,
        success: true,
        error_code: 0,
        message: 'Validation error',
        data: { item: error.messages },
      })
    }

    // custom error
    const customError = error as any
    if (customError.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.status(customError.status).send({
        status: 404,
        success: false,
        error_code: 0,
        message: 'Data row not found',
        data: {},
      })
    }

    if (customError.code === 'ER_ROW_IS_REFERENCED_2') {
      return ctx.response.status(customError.status).send({
        status: 403,
        success: false,
        error_code: 0,
        message: 'Data that has been used cannot be deleted!',
        data: {},

      })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
