/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('favorites', function(table) {
    table.integer('post_id').unsigned().notNullable();          
    table.integer('owner_id').unsigned().notNullable();        
    table.dateTime('add_date').defaultTo(knex.fn.now());

    // Foreign keys
    table.primary(['post_id', 'owner_id']); 
    table.foreign('owner_id').references('users.user_id').onDelete('CASCADE');
    table.foreign('post_id').references('posts.post_id').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('favorites');
};
