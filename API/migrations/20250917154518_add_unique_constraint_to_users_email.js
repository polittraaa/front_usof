/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.unique('email'); // add unique constraint
  });
}

export async function down(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropUnique('email'); // remove unique constraint if rolling back
  });
}
