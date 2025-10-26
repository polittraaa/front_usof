export async function up(knex) {
  return knex.schema.table('users', t => {
    t.renameColumn('users_id', 'user_id');
  });
}
export async function down(knex) {
    return knex.schema.table('users',t => {
      t.renameColumn('user_id','users_id');
    });
}