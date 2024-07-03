/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// bouncer
import { manageUser, managePost } from '#abilities/main'

router.get('/', ({ response }) => {
  response.redirect().toPath('/api')
})

router
  .group(() => {
    router.get('/', () => {
      return { code: 200, success: true, message: 'Welcome bruh!' }
    })

    // auth, generate token
    router.post('auth/login', '#controllers/auth_controller.login')

    router
      .group(() => {
        // account
        router.get('account', '#controllers/account_controller.show')
        router.post('account', '#controllers/account_controller.update')
        router.get('account/refresh_token', '#controllers/auth_controller.refresh_token')
        router.post('account/logout', '#controllers/account_controller.logout')

        router
          .group(() => {
            // user statuses
            router.get('user/statuses', '#controllers/user_statuses_controller.index')
            router.post('user/statuses', '#controllers/user_statuses_controller.store')
            router.get('user/statuses/:id', '#controllers/user_statuses_controller.show')
            router.post('user/statuses/:id', '#controllers/user_statuses_controller.update')
            router.post('user/statuses/delete/:id', '#controllers/user_statuses_controller.destroy')

            // user roles
            router.get('user/roles', '#controllers/user_roles_controller.index')
            router.post('user/roles', '#controllers/user_roles_controller.store')
            router.get('user/roles/:id', '#controllers/user_roles_controller.show')
            router.post('user/roles/:id', '#controllers/user_roles_controller.update')
            router.post('user/roles/delete/:id', '#controllers/user_roles_controller.destroy')

            // users
            router.get('users', '#controllers/users_controller.index')
            router.post('users', '#controllers/users_controller.store')
            router.get('users/:id', '#controllers/users_controller.show')
            router.post('users/:id', '#controllers/users_controller.update')
            router.post('users/delete/:id', '#controllers/users_controller.destroy')
          })
          .use(middleware.bouncer(manageUser))

        router
          .group(() => {
            router.get('posts', '#controllers/posts_controller.index')
            router.post('posts', '#controllers/posts_controller.store')
            router.get('posts/:id', '#controllers/posts_controller.show')
            router.post('posts/:id', '#controllers/posts_controller.update')
            router.post('posts/delete/:id', '#controllers/posts_controller.destroy')
          })
          .use(middleware.bouncer(managePost))
      })
      .use(middleware.auth())
  })
  .prefix('v1')

/*
|--------------------------------------------------------------------------
| Uploaded Files Routes
|--------------------------------------------------------------------------
*/

import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)
  const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('uploads', normalizedPath)
  return response.download(absolutePath)
})
