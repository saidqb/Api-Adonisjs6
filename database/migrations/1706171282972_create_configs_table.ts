import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'configs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key')
      table.text('value','longtext')
      table.integer('is_json').defaultTo(0)

      // index
      table.index('key', 'key')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
