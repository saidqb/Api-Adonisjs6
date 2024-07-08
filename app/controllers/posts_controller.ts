import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#core/base_controller'
import Post from '#models/post'
import { existsRule } from '#rules/exists'
import PostPolicy from '#policies/post_policy'
import string from '@adonisjs/core/helpers/string'

export default class PostsController extends BaseController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {

    const params = request.all()

    let query: any = {
      table_and_join: 'from posts',
      field_show: [
        'id',
        'user_id',
        'title',
        'slug',
        'content',
        'type',
        'status',
        'image_url',
        'view_count',
        'created_at',
        'updated_at',
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
  async store({ request, auth }: HttpContext) {
    const user = await auth.authenticate()
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        user_id: vine.number().use(existsRule({ table: 'users', column: 'id' })),
        title: vine.string(),
        content: vine.string(),
        slug: vine.string().optional(),
        image_url: vine.string().optional(),
        status: vine.string().optional(),
        type: vine.string().optional(),
      })
    )
    var output = await validator.validate({ user_id: user.id, ...payload })


    const data = await Post.create(output)

    var upData = { slug: string.slug(output.title + '-' + data.id) }

    await data?.merge(upData).save()

    this.response('Post created successfully', { item: data })
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await Post.findOrFail(params.id)
    await data.load('user')
    await data.user.load('user_role')
    await data.user.load('user_status')

    this.response('Post retrieved successfully', { item: data })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, auth, bouncer }: HttpContext) {
    const user = await auth.authenticate()
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        id: vine.number().use(existsRule({ table: 'posts', column: 'id' })),
        user_id: vine.number().use(existsRule({ table: 'users', column: 'id' })),
        title: vine.string(),
        content: vine.string(),
        image_url: vine.string().optional(),
        status: vine.string().optional(),
        type: vine.string().optional(),
      })
    )
    const output = await validator.validate({ id: params.id, user_id: user.id, ...payload })
    const data = await Post.findOrFail(params.id)

    if (await bouncer.with(PostPolicy).denies('edit', data)) {
      return this.responseError('Cannot edit the post', 403)
    }

    await data?.merge(output).save()

    this.response('Post updated successfully', { item: data })
  }

  /**
   * Delete record
   */
  async destroy({ params, bouncer }: HttpContext) {
    const data = await Post.findOrFail(params.id)

    if (await bouncer.with(PostPolicy).denies('delete', data)) {
      return this.responseError('Cannot delete the post', 403)
    }

    await data?.delete()

    this.response('Post deleted successfully')
  }
}
