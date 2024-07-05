import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import * as query from '#core/concerns/query'

@inject()
export default class BaseController {
  protected db: any;
  protected query: any;

  constructor(protected ctx: HttpContext) {

    this.db = db

    this.query = query
  }


  /**
   * send success response method.
   */
  async response(message: string, data: any = null, code: number = 200, error_code: any = 0) {
    const response: { success: boolean; message: string; data?: any, status: number, error_code: number } = {
      status: code,
      success: true,
      error_code,
      message,
      data
    }

    if (response.data.item === undefined) {
      response.data.item = {}
    }

    this.ctx.response.status(code).send(response)
  }

  /**
   * send success response method.
   */
  async responseList(message: string, data: any = null, code: number = 200, error_code: any = 0) {
    const response: { success: boolean; message: string; data?: any, status: number, error_code: number } = {
      status: code,
      success: true,
      error_code,
      message,
      data
    }

    if (response.data.items === undefined) {
      response.data.items = []
    }
    if (response.data.pagination === undefined) {
      response.data.pagination = {}
    }

    this.ctx.response.status(code).send(response)
  }


  /**
   * send error response method.
   */
  async responseError(message: string, code: number = 400, data: any = null, error_code: any = 0) {
    const response: { success: boolean; message: string; data?: any, status: number, error_code: number } = {
      status: code,
      success: true,
      error_code,
      message,
      data
    }

    if (data === null) {
      response.data = {}
    }

    this.ctx.response.status(code).send(response)
  }
}
