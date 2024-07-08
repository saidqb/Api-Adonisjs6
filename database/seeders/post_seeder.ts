import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Post from '#models/post'

export default class extends BaseSeeder {
  static environment = ['development', 'testing', 'production']

  async run() {
    await Post.updateOrCreateMany('id', [
      {
        id: 1,
        userId:1,
        title:'Hello World',
        slug:'hello-world',
        content:'Hello World Content',
        type:'post',
        status:'publish',
        imageUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png',
        viewCount: 0,
      },
      {
        id: 2,
        userId:1,
        title:'Hello World 2',
        slug:'hello-world-2',
        content:'Hello World Content 2',
        type:'post',
        status:'publish',
        imageUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png',
        viewCount: 0,
      }
    ])
  }
}
