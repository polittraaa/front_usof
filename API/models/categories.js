class Cat {
  constructor(db) {
    this.db = db;
  }

  async get_cat() {
    return this.db('categories');
  }

  async get_cat_id(cid) {
    return this.db('categories')
    .where({category_id: cid})
    .first()
  }

  async get_cat_id_post(cid) {
    const cat = await this.db('post_categories as pc')
    .join('posts as p', 'pc.post_id', 'p.post_id')
    .where({'pc.category_id': cid})
    .select('p.*');
    return cat;
  }

  async new_cat(title) {
    const [cat_id] = await this.db('categories')
    .insert({
      title,
      category_description: "..."
    });
    
    const cat = await this.db('categories')
    .where({ category_id: cat_id })
    .first();
    return cat;
  }
  
  async update_cat(category_id, updates) {
    await this.db('categories')
      .where({ category_id })
      .update(updates);
  }
  async del_cat(category_id){
     await this.db('categories')
      .where({ category_id })
      .del();
  }
}
export default Cat