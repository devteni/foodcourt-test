import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meal_addons', function (table) {
    table.increments('id');
    table.string('name', 191).unique().notNullable();
    table.text('description').nullable();
    table.integer('price').notNullable();
    table
      .bigInteger('category_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('meal_categories');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('meal_addons');
}
