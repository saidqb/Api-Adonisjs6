import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Config from '#models/config'

export default class extends BaseSeeder {
  static environment = ['development', 'testing', 'production']

  async run() {
    await Config.updateOrCreateMany('key', [
      {
        id: 1,
        key: 'site_title',
        value: 'My Website',
      },
       {
        id: 2,
        key: 'site_tagline',
        value: 'This is my website',
      },
      {
        id: 3,
        key: 'site_description',
        value: 'This is my website',
      },
      {
        id: 4,
        key: 'site_keywords',
        value: 'website, my website',
      },
      {
        id: 5,
        key: 'site_author',
        value: 'saidqb',
      },

      // Add more configs here



    ])
  }
}
