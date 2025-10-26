class User {
    constructor(db) {
        this.db = db;
    }

    async find_user(email, login) {
        const user = await this.db('users')
            .where({ email, login })
            .first();
        return(user);
    }

    async create_user(login, hash, name='', email, role='user') {
        const [user_id] = await this.db('users').insert({
            login,
            password_hash: hash,
            full_name: name,
            email,
            rating: 0,
            role: role, 
            created_at: new Date(),
            is_email_confirmed: false
        })
        return user_id; //test erneut mit register und new user 
    }

    async find_by_login(login) {
        const user = await this.db('users')
            .where({ login })
            .first();
        return (user != undefined)? true : false;
    }

    async update_pass(hashedPass, decoded) {
        await this.db('users')
        .where({ email: decoded.email })
        .update({password_hash: hashedPass});
    }

    async prof_email(email) {
        const row = await this.db('users')
        .where({ email })
        .select('is_email_confirmed')
        .first();
        // console.log(row?.is_email_confirmed)
        return !!row?.is_email_confirmed;
    }

    async update_conf(decoded) {
        await this.db('users')
        .where({ email: decoded.email })
        .update({ is_email_confirmed: true });
    }

    //user path 
    async find_by_id(id) {
        const user = await this.db('users')
            .where({ user_id: id })
            .first();
        return(user);
    }

    async get_users() {
        const users = await this.db('users')
        return(users);
    }

    async del_user(id) {
        await this.db('users')
        .where({ user_id: id })
        .del();
    }

    async update_photo(userId, photo) {
        await this.db('users')
        .where({ user_id: userId })
        .update({ picture: photo });
    }

    async update_user(userId, updates, need_email_conf) {
        await this.db('users')
        .where({ user_id: userId })
        .update(updates);
        if (need_email_conf){
           await this.db('users')
            .where({ user_id: userId })
            .update({ is_email_confirmed: false }); 
        }
    }
   
    async create_new_user(login, hash, name='', email, role='user') {
        const [user_id] = await this.db('users').insert({
            login,
            password_hash: hash,
            full_name: name,
            email,
            picture: 'default.png',
            rating: 0,
            role, 
            created_at: new Date(),
            is_email_confirmed: true
        })
        return user_id;
    }
}
export default User