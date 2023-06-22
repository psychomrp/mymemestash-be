/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('password_resets', function(table) {
        table.increments('id').primary();
        table.string('email').notNullable();
        table.string('token').notNullable();
        table.timestamp('expires_at').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('password_resets');
};
  