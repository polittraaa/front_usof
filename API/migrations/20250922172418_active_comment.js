export async function up(knex) {
  await knex.schema.alterTable('comments', (table) => {
    table
      .enu('target_state', ['active', 'inactive'], {
        useNative: true,
        enumName: 'comment_target_state'
      })
      .notNullable()
      .defaultTo('active');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('comments', (table) => {
    table.dropColumn('target_state');
  });
}
