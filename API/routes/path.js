import { Router } from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/users.js";
import Post from "../models/posts.js";
import Cat from "../models/categories.js";
import Comment from '../models/comments.js';
import Fav from '../models/favorites.js';

//auth
import handleLogin from '../controllers/auth/login.js';
import handleRegister from '../controllers/auth/register.js';
import handleLogout from '../controllers/auth/logout.js';
import handleConfirm from '../controllers/auth/confirm_pass.js';
import handleReset from '../controllers/auth/reset_pass.js';
import handleEmailConfirm from "../controllers/auth/confirm_email.js";

//user
import getUsers from '../controllers/users/get_users.js';
import getUser from '../controllers/users/get_user_id.js';
import handleAvatar from '../controllers/users/upload_photo.js';
import handleUpdate from '../controllers/users/update_user.js';
import handleDelete from '../controllers/users/del_user.js';
import { handleNewUser} from '../controllers/users/create_user.js';

//posts
import { searchPosts } from '../controllers/post/search_posts.js';
import { getPosts } from '../controllers/post/get_posts.js';
import { getPost } from '../controllers/post/get_post.js';
import { getComments } from '../controllers/post/get_comment.js';
import { handleComment } from '../controllers/post/create_comment.js';
import { handleGetCategories } from '../controllers/post/get_category.js';
import { handleGetLikes } from '../controllers/post/get_likes.js';
import { handlePost } from '../controllers/post/create_post.js';
import { handleLikes } from '../controllers/post/create_like.js';
import { handleUpdatePost } from '../controllers/post/update_post.js';
import { handleDeletePost } from '../controllers/post/delete_post.js';
import { handleDeleteLike } from '../controllers/post/delete_like.js';

//categories
import { getCat } from '../controllers/categories/get_cat.js';
import { getCatId }  from '../controllers/categories/get_cat_id.js';
import { getCatIdPost } from '../controllers/categories/get_cat_id_post.js';
import { handleCreatetCat } from '../controllers/categories/create_cat.js';
import { handleEditCat } from '../controllers/categories/edit_cat.js';
import { handleDeleteCat } from '../controllers/categories/del_cat.js';

//comments
import getCommentById from '../controllers/comment/get_comment_by_id.js';
import getLikesByCommentId from '../controllers/comment/get_likes_by_comment_id.js';
import createLikeForComment from '../controllers/comment/create_like_for_comment.js';
import updateComment from '../controllers/comment/update_comment.js';
import deleteComment from '../controllers/comment/delete_comment.js';
import deleteLikeForComment from '../controllers/comment/delete_like_for_comment.js';

//fav
import { getFavorite } from '../controllers/favorites/get_fav.js';
import { addPostFav } from '../controllers/favorites/add_fav.js';
import { deletePostFav } from '../controllers/favorites/del_fav.js';

//middleware
import { emailCheck } from '../middlewares/email_check.js';
import { requireLogin } from "../middlewares/session_auth.js";
import upload from '../middlewares/photo_upload.js';
import { roleCheck } from '../middlewares/role_check.js';
import { roleCheckComment } from '../middlewares/role_check_comments.js';
import { adminCheck } from '../middlewares/admin_check.js';


const router = Router();

//auth
router.post('/auth/login', emailCheck(db, User), (req, res) => handleLogin(req, res, db, bcrypt, User));
router.post('/auth/register', (req, res) => handleRegister(req, res, db, bcrypt, jwt, User));
router.post('/auth/logout', (req, res) => handleLogout(req, res));
router.post('/auth/password-reset', (req, res) => handleReset(req, res, jwt));
router.post('/auth/password-reset/:confirm_token', (req, res) => handleConfirm(req, res, db, jwt, bcrypt, User));
//
router.get('/auth/confirm/:token', (req, res) => handleEmailConfirm(req, res, db, jwt, User));

//user
router.get('/users', (req, res) => getUsers(req, res, db, User));
router.get('/users/:user_id', (req, res) => getUser(req, res, db, User));
router.patch('/users/avatar', requireLogin, upload.single("avatar"), (req, res) => handleAvatar(req, res, db, User));
router.patch('/users/:user_id', requireLogin, (req, res) => handleUpdate(req, res, db, jwt, User));
router.delete('/users/:user_id', requireLogin, (req, res) => handleDelete(req, res, db, User));
router.post('/users', requireLogin, roleCheck(db, Post), (req, res) => handleNewUser(req, res, db, bcrypt, User));

//posts
router.get('/posts/search', roleCheck(db, Post), (req, res) => searchPosts(req, res, db, Post));
router.get('/posts', roleCheck(db, Post), (req, res) => getPosts(req, res, db, Post));
router.get('/posts/:post_id', roleCheck(db, Post), (req, res) => getPost(req, res, db, Post));
router.get('/posts/:post_id/comments', roleCheck(db, Post), (req, res) => getComments(req, res, db, Post));
router.get('/posts/:post_id/like', roleCheck(db, Post), (req, res) => handleGetLikes(req, res, db, Post));
router.get('/posts/:post_id/categories', (req, res) => handleGetCategories(req, res, db, Post));
router.post('/posts/:post_id/comments', requireLogin, (req, res) => handleComment(req, res, db, Post));
router.post('/posts/', requireLogin, (req, res) => handlePost(req, res, db, Post));
router.post('/posts/:post_id/like', requireLogin, (req, res) => handleLikes(req, res, db, Post));
router.patch('/posts/:post_id', requireLogin, roleCheck(db, Post), (req, res) => handleUpdatePost(req, res, db, Post));
router.delete('/posts/:post_id', requireLogin, roleCheck(db, Post), (req, res) => handleDeletePost(req, res, db, Post));
router.delete('/posts/:post_id/like', requireLogin, roleCheck(db, Post), (req, res) => handleDeleteLike(req, res, db, Post));

//categories
router.get('/categories', (req, res) => getCat(req, res, db, Cat));
router.get('/categories/:category_id', requireLogin, (req, res) => getCatId(req, res, db, Cat));
router.get('/categories/:category_id/posts', (req, res) => getCatIdPost(req, res, db, Cat));
router.post('/categories', requireLogin, adminCheck(db, User), (req, res) => handleCreatetCat(req, res, db, Cat));
router.patch('/categories/:category_id', requireLogin, adminCheck(db, User), (req, res) => handleEditCat(req, res, db, Cat));
router.delete('/categories/:category_id', requireLogin, adminCheck(db, User), (req, res) => handleDeleteCat(req, res, db, Cat));

// comment
router.get('/comments/:comment_id', requireLogin, (req, res) => getCommentById(req, res, db, Comment));
router.get('/comments/:comment_id/like', requireLogin, roleCheckComment(db, Comment), (req, res) => getLikesByCommentId(req, res, db, Comment));
router.post('/comments/:comment_id/like', requireLogin, (req, res) => createLikeForComment(req, res, db, Comment));
router.patch('/comments/:comment_id', requireLogin, roleCheckComment(db, Comment), (req, res) => updateComment(req, res, db, Comment));
router.delete('/comments/:comment_id', requireLogin, roleCheckComment(db, Comment), (req, res) => deleteComment(req, res, db, Comment));
router.delete('/comments/:comment_id/like', requireLogin, roleCheckComment(db, Comment), (req, res) => deleteLikeForComment(req, res, db, Comment));

//favaorites 
router.get('/favorites', requireLogin, (req, res) => getFavorite(req, res, db, Fav));
router.post('/favorites/:post_id', requireLogin, (req, res) => addPostFav(req, res, db, Fav, Post));
router.delete('/favorites/:post_id', requireLogin, (req, res) => deletePostFav(req, res, db, Fav));

export default router;
