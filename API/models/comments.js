class Comment {
    constructor(db) {
        this.db = db
    }

    async find_by_id(comment_id) {
        return await this.db("comments").where({ comment_id }).first();
    }

    async get_likes(role, comment_id, user_id) {
        const base = this.db('likes as l')
            .join('comments as c', 'l.target_id', 'c.comment_id')
            .select(
                'l.like_id',
                'l.publish_date',
                'l.author_id as like_author',
                'l.like_type',
                'c.comment_id',
                'c.author_id as comment_author'
            ).where('c.comment_id', comment_id)
            .andWhere('l.target_type', 'comment');

        if (role === 'admin') return base;
        if (role === 'user') {
        return base.where(qb => {
            qb.where('c.target_state', 'active')
            .orWhere('c.author_id', user_id);
        });
        }
        return base.where('c.target_state', 'active');
    }

    async get_role(id) {
        const role = await this.db('users')
        .where({user_id: id})
        .select('role')
        .first();
      return role;
    }

    async new_like(comment_id, id, like_type){
        const [like_id] = await this.db('likes').insert({
            author_id: id,
            target_id: comment_id,
            publish_date: new Date(),
            target_type: 'comment',
            like_type
        });
        const like = await this.db('likes')
        .where({ like_id })
        .first();
        return like;
    }

    async update(id, updates) {
        await this.db("comments")
            .where({ comment_id: id })
            .update(updates);

        return this.find_by_id(id);
    }

    async delete(comment_id) {
        return await this.db("comments").where({ comment_id }).del();
    }

    async del_like(role, id, comment_id) {
        if (role === 'admin') {
            return this.db('likes')
            .where({ target_id: comment_id })
            .andWhere({ target_type: 'comment' })
            .del();
        }  
        if (role === 'user') {
            return  this.db('likes')
            .where({ target_id: comment_id, author_id: id })
            .del();
        }
        return 0;
    }
}

export default Comment;