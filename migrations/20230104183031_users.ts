import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function (table) {
    table.increments('id');
    table.string('email', 191).unique().notNullable().index();
    table.string('password', 255).notNullable().index();
    table.string('role', 100).notNullable().defaultTo('regular').index();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
