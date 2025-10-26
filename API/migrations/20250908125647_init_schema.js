/*
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('users_id').primary();
    table.string('login', 50).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('full_name', 100).notNullable();
    table.string('email', 100).notNullable();
    table.string('picture', 255).notNullable().defaultTo('default.png');
    table.integer('rating').defaultTo(null);
    table.enu('role', ['admin', 'user']).defaultTo('user');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('is_email_confirmed').defaultTo(false);
  });

  await knex.schema.createTable('posts', (table) => {
    table.increments('post_id').primary();
    table.integer('author_id').unsigned().notNullable()
      .references('users_id').inTable('users').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.enu('post_status', ['active', 'inactive']).defaultTo('active');
    table.text('content').notNullable();
    table.string('image_url', 255);
    table.dateTime('publish_date').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('categories', (table) => {
    table.increments('category_id').primary();
    table.string('title', 50).notNullable().unique();
    table.text('category_description').notNullable();
  });

  await knex.schema.createTable('post_categories', (table) => {
    table.integer('post_id').unsigned().notNullable();
    table.integer('category_id').unsigned().notNullable();
    table.primary(['post_id', 'category_id']);
    table.foreign('post_id').references('post_id').inTable('posts').onDelete('CASCADE');
    table.foreign('category_id').references('category_id').inTable('categories').onDelete('CASCADE');
  });

  await knex.schema.createTable('comments', (table) => {
    table.increments('comment_id').primary();
    table.integer('author_id').unsigned().notNullable()
      .references('users_id').inTable('users').onDelete('CASCADE');
    table.dateTime('publish_date').defaultTo(knex.fn.now());
    table.text('content').notNullable();
  });

  await knex.schema.createTable('likes', (table) => {
    table.increments('like_id').primary();
    table.integer('author_id').unsigned().notNullable()
      .references('users_id').inTable('users').onDelete('CASCADE');
    table.dateTime('publish_date').defaultTo(knex.fn.now());
    table.enu('target_type', ['post', 'comment']).notNullable();
    table.integer('target_id').unsigned().notNullable();
    table.enu('like_type', ['like', 'dislike']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('likes');
  await knex.schema.dropTableIfExists('comments');
  await knex.schema.dropTableIfExists('post_categories');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('users');
}