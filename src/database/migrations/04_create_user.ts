import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('login', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('subName').notNullable();
        table.string('email').notNullable().unique();
        table.string('token').defaultTo('')
        table.string('password').notNullable();

    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('login')
}