import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  static environment = ['development', 'testing', 'production']

  async run() {
    await User.updateOrCreateMany('id', [
      {
        id: 1,
        userRoleId: 1,
        userStatusId: 1,
        email: 'superadmin@gmail.com',
        password: 'superadmin',
        name: 'Super admin',
        emailVerifiedAt: null,
        avatarUrl: null,
      },
      {
        id: 100,
        userRoleId: 2,
        userStatusId: 1,
        email: 'admin@gmail.com',
        password: 'admin',
        name: 'Admin',
        emailVerifiedAt: null,
        avatarUrl: null,
      },
      {
        id: 105,
        userRoleId: 3,
        userStatusId: 1,
        email: 'user@gmail.com',
        password: 'user',
        name: 'User',
        emailVerifiedAt: null,
        avatarUrl: null,
      },
    ])
  }
}
