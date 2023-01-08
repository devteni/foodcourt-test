import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meal_categories', function (table) {
    table.increments('id');
    table.string('name', 191).unique().notNullable();
    table
      .bigInteger('brand_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('brands')
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('meal_addons');
}
