import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      table.string('title').notNullable()
      table.string('slug')
      table.text('content','longtext')
      table.string('type',60).defaultTo('post')
      table.string('status',60).defaultTo('publish')
      table.integer('view_count').defaultTo(0)
      table.string('image_url')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index('slug', 'slug')
      table.index('type', 'type')
      table.index('status', 'status')
      table.index(['user_id','type','status'], 'index_1')

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
