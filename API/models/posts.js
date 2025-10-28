class Post {
  constructor(db) {
    this.db = db;
  } 

  async get_posts(limit, offset, role, userId, sort = "rating", order = "desc", filters = {}) {
    let query = this.db('posts') 
        .select( 
            'posts.*', 
            this.db.raw("COUNT(CASE WHEN likes.like_type = 'like' THEN 1 END) as likes_count"), 
            this.db.raw("COUNT(CASE WHEN likes.like_type = 'dislike' THEN 1 END) as dislikes_count"), 
            this.db.raw("COUNT(CASE WHEN likes.like_type = 'like' THEN 1 END) - COUNT(CASE WHEN likes.like_type = 'dislike' THEN 1 END) as rating") 
        ) 
        .leftJoin('likes', 'posts.post_id', 'likes.target_id') 
        .groupBy('posts.post_id');         

    if (userId) {
        if (role === 'admin') {
            // admin all
        } else {
            query = query.where(function() {
                this.where('posts.post_status', 'active')
                    .orWhere(function() {
                        this.where('posts.post_status', 'inactive')
                            .andWhere('posts.author_id', userId);
                    });
            });
        }
    } else {
        query = query.where('posts.post_status', 'active');
    }

    // --- filtering ---
    if (filters.categories && filters.categories.length > 0) {
        query = query
            .join('post_categories as pc', 'posts.post_id', 'pc.post_id')
            .whereIn('pc.category_id', filters.categories);
    }
    
    if (filters.date_from) {
        query = query.where('posts.publish_date', '>=', filters.date_from + " 00:00:00");
    }

    if (filters.date_to) {
        query = query.where('posts.publish_date', '<=', filters.date_to + " 23:59:59");
    }
    
    if (filters.status) {
        query = query.where('posts.post_status', filters.status);
    }

    // --- sorting ---
    if (sort === 'date') { 
        query = query.orderBy('posts.publish_date', order); 
    } else if (sort === 'rating') { 
        query = query.orderBy('rating', order); 
    } else { 
        query = query.orderBy('likes_count', order); 
    } 
    
    const posts = await query.limit(limit).offset(offset); 
    
    return { 
        posts: posts 
    };
  }

  async search_posts(limit, offset, role, userId, search = "") {

    console.log('Searching posts with search string:', search);
    let query = this.db('posts')
        .select(
            'posts.*',
            this.db.raw("COUNT(CASE WHEN likes.like_type = 'like' THEN 1 END) as likes_count"),
            this.db.raw("COUNT(CASE WHEN likes.like_type = 'dislike' THEN 1 END) as dislikes_count"),
            this.db.raw("COUNT(CASE WHEN likes.like_type = 'like' THEN 1 END) - COUNT(CASE WHEN likes.like_type = 'dislike' THEN 1 END) as rating")
        )
        .leftJoin('likes', 'posts.post_id', 'likes.target_id')
        .groupBy('posts.post_id');

    // visibility logic (admin/user/guest)
    if (userId) {
        if (role !== 'admin') {
            query = query.where(function() {
                this.where('posts.post_status', 'active')
                    .orWhere(function() {
                        this.where('posts.post_status', 'inactive')
                            .andWhere('posts.author_id', userId);
                    });
            });
        }
    } else {
        query = query.where('posts.post_status', 'active');
    }

    // simple title search (optional)
    if (search && search.trim() !== "") {
        query = query.where('posts.title', 'like', `%${search}%`);
    }

    // you can choose how to sort, for now let's default by rating desc
    query = query.orderBy('rating', 'desc');

    const posts = await query.limit(limit).offset(offset);

    return { 
        posts: posts 
    };
  }

  async count(role, userId) {
    const q = this.db('posts');
    if (role === 'guest') q.where('post_status', 'active');
    else if (role === 'user')
      q.where(qb =>
        qb.where('post_status', 'active').orWhere('author_id', userId)
      );
    const result = await q.count('* as total');
    return result[0].total;
  }

  async get_post(role, userId, post_id) {
    const base = this.db('posts');
    if (role === 'admin') return base.where('post_id', post_id).first();
    if (role === 'user') {
      return base
        .where(qb => {
          qb.where({ post_id })
            .andWhere('post_status', 'active');
      })
      .orWhere(qb => {
        qb.where({ post_id })
          .andWhere('author_id', userId);
      })
      .first();
    }
    return base.where('post_id', post_id).where({post_status: 'active'}).first();
  }

   async get_role(id) {
        const role = await this.db('users')
        .where({user_id: id})
        .select('role')
        .first();
      return role;
    }
    async get_author(post_id) {
        const author = await this.db('posts')
        .where({post_id})
        .select('author_id')
        .first();
      return author;
    }

    async get_comments(role, post_id, user_id) {
      const base =  this.db('comments as c')
      .join('posts as p', 'c.to_post_id', 'p.post_id')
      .select(
         'c.comment_id',
         'c.content',
         'c.publish_date',
         'c.author_id as comment_author',
         'p.post_id',
         'p.post_status',
         'p.author_id as post_author'
      )
      .where('c.to_post_id', post_id)
      .orderBy('publish_date', 'desc');

      if (role === 'admin') return base;
      if (role === 'user') {
        return base
        .where(qb => {
          qb.where('p.post_status', 'active')
            .orWhere('p.author_id', user_id);
      });
    }
    return base.where('p.post_status', 'active');
  }

  async new_comment(post_id, id, content) {
    const [comment_id] = await this.db('comments').insert({
      author_id: id,
      publish_date: new Date(),
      content: content,
      to_post_id: post_id,
      parent_id: null
    });
    const comment = await this.db('comments')
    .where({ comment_id })
    .first();
    return comment;
  }

  async get_category(post_id) {
    const cat = await this.db('categories as c')
    .join('post_categories as pc', 'c.category_id', 'pc.category_id')
    .where({'pc.post_id': post_id})
    .select('c.*');
    return cat;
  }

  async get_likes(role, post_id, user_id) {
      const base = this.db('likes as l')
      .join('posts as p', 'l.target_id', 'p.post_id')
      .select(
        'l.like_id',
        'l.publish_date',
        'l.author_id as like_author',
        'l.like_type',
        'p.post_id',
        'p.post_status',
        'p.author_id as post_author'
      ).where('p.post_id', post_id)
      .andWhere('l.target_type', 'post');

    if (role === 'admin') return base;
    if (role === 'user') {
      return base.where(qb => {
        qb.where('p.post_status', 'active')
          .orWhere('p.author_id', user_id);
      });
    }
    return base.where('p.post_status', 'active');
  }

  async new_post(title, content, categoryNames, id) {
    return this.db.transaction(async trx => {
      // Find cat IDs
      let category_ids = [];
  
      if (Array.isArray(categoryNames) && categoryNames.length > 0) {
        const rows = await trx('categories')
          .whereIn('title', categoryNames)
          .select('category_id');

        category_ids = rows.map(row => row.category_id);
      }

      // Insert post
      const [post_id] = await trx('posts').insert({
        author_id: id,
        title,
        post_status: 'active',
        content,
        publish_date: new Date()
      });

      let join_rows = [];

      // Add into post_categories
      if (category_ids.length > 0) {
        join_rows = category_ids.map(category_id => ({
          post_id,
          category_id
        }));
        await trx('post_categories').insert(join_rows);
      }

      // 4. Get full post
      const post = await trx('posts')
        .where({ post_id })
        .first();

      return { post, join_rows };
    });
  }

  // async new_like(post_id, id, like_type){
  //    const [like_id] = await this.db('likes').insert({
  //     author_id: id,
  //     target_id: post_id,
  //     publish_date: new Date(),
  //     like_type
  //   });
  //   const like = await this.db('likes')
  //   .where({ like_id })
  //   .first();
  //   return like;
  // }

  async toggleLike(post_id, user_id, like = true, type) {
    const existing = await this.db('likes')
      .where({ author_id: user_id, target_id: post_id })
      .first();

    if (existing) {
      if (existing.like_type === type) {
        // если тот же тип — удалить (аннулируем)
        await this.db('likes')
          .where({ like_id: existing.like_id })
          .del();
        return null;
      } else {
        // если другой тип — обновляем
        await this.db('likes')
          .where({ like_id: existing.like_id })
          .update({ like_type: type });
        return await this.db('likes').where({ like_id: existing.like_id }).first();
      }
    } else {
      // если записи нет — создаем
      const [like_id] = await this.db('likes').insert({
        author_id: user_id,
        target_id: post_id,
        publish_date: new Date(),
        like_type: type
      });
      return await this.db('likes').where({ like_id }).first();
    }
  }

 async update_post(post_id, updates){
    const { category, ...post_updates } = updates;

    if (Object.keys(post_updates).length > 0){
      await this.db('posts')
        .where({ post_id })
        .update(post_updates);
    }
    if (category !== undefined ){
        await this.db('post_categories')
        .where({ post_id })
        .del();

      const inserts = category.map(catId => ({
        post_id,
        category_id: catId
      }));

      await this.db('post_categories').insert(inserts);
    }
  }

  async del_post(role, id, post_id) {
    if (role === 'admin') {
      return this.db('posts')
      .where({ post_id })
      .del();
    }  
    if (role === 'user') {
      return  this.db('posts')
      .where({ post_id, author_id: id })
      .del();
    }
    return 0;
  }

  async del_like(role, id, post_id) {
    if (role === 'admin') {
      return this.db('likes')
      .where({ target_id: post_id })
      .del();
    }  
    if (role === 'user') {
      return  this.db('likes')
      .where({ target_id: post_id, author_id: id })
      .del();
    }
    return 0;
  }
}
export default Post