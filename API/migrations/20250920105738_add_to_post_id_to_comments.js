export async function up(knex){
    await knex.schema.table('comments', (table) => {
        table.integer('to_post_id').unsigned().notNullable()
        .references('post_id').inTable('posts')
        .onDelete('CASCADE');

         table.integer('parent_id').unsigned().nullable()
        .references('comment_id').inTable('comments')
        .onDelete('CASCADE');
    });
}

export async function down(knex) {
  await knex.schema.table('comments', (table) => {
    table.dropForeign(['to_post_id']); // remove foreign key
    table.dropColumn('to_post_id');    // remove column
    
    table.dropForeign(['parent_id']);
    table.dropColumn('parent_id'); 
  });
};
