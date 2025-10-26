class Fav {
    constructor(db) {
        this.db = db;
    }

    async get_fav(id) {
        const fav_list = await this.db('favorites')
            .where({ owner_id: id })
        return(fav_list);
    }

    async add_fav(authorId, post_id) {
        const target = await this.db('posts')
        .where({ post_id })
        .select('post_status')
        .first();

        if (!target || target.post_status !== 'active') {
        return;
        }

        await this.db('favorites').insert({
            owner_id: authorId,
            post_id,
            add_date: new Date(),
        });

        const fav = await this.db('favorites')
            .where({ owner_id: authorId, post_id })
            .first();
        return fav;
    }

   async del_fav(authorId, post_id) {
    const target = await this.db('posts')
        .where({ post_id })
        .select('post_status')
        .first();

    if (!target || target.post_status !== 'active') return;

    await this.db('favorites')
        .where({ owner_id: authorId, post_id })
        .del();
    }

}
export default Fav;