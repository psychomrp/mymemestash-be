/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('stashes', function (table) {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.string('stash_code').notNullable();
        table.string('title').notNullable();
        table.json('tags').notNullable();
        table.bigInteger('views').nullable().defaultTo(0);
        table.bigInteger('shares').nullable().defaultTo(0);
        table.bigInteger('reactions').notNullable().defaultTo(0);
        table.json('reactors').nullable();
        table.json('items').nullable();
        table.string('privacy').defaultTo('public').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('stashes');
};
