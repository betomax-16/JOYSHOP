import * as express from 'express';
import { MiddlewareAuth } from '../middlewares/auth';
import { UsuarioCtrl } from '../controllers/user';
import { ProductoCtrl } from '../controllers/product';
import { CommentaryCtrl } from '../controllers/commentary';

const api = express.Router();

api.route('/signup')
    .post( UsuarioCtrl.signUp );
api.route('/signin')
    .post( UsuarioCtrl.signIn );
api.route('/confirm/:id')
    .get( UsuarioCtrl.confirm );
api.route('/passrecovery')
    .put( UsuarioCtrl.passRecovery );

// Users
api.route('/user')
    .get( MiddlewareAuth.isAuth, UsuarioCtrl.getUser )
    .put( MiddlewareAuth.isAuth, UsuarioCtrl.updateUser );
// User public
api.route('/user/:id')
    .get( UsuarioCtrl.getUserPublic );

// Products
api.route('/product')
    .get( MiddlewareAuth.isAuth, ProductoCtrl.getProducts )
    .post( MiddlewareAuth.isAuth, ProductoCtrl.createProduct );
api.route('/product/:idProduct')
    .get( MiddlewareAuth.isAuth, ProductoCtrl.getProduct )
    .put( MiddlewareAuth.isAuth, ProductoCtrl.updateProduct )
    .delete( MiddlewareAuth.isAuth, ProductoCtrl.deleteProduct );
api.route('/public/product/:idProduct')
    .get( ProductoCtrl.getPublicProduct );
api.route('/search')
    .get( ProductoCtrl.search );

// Commentaries
api.route('/product/:idProduct/commentary')
    .get( CommentaryCtrl.getCommentariesByProduct )
    .post( MiddlewareAuth.isAuth, CommentaryCtrl.createCommentary );
api.route('/commentary/:idCommentary')
    .get( CommentaryCtrl.getCommentary )
    .put( MiddlewareAuth.isAuth, CommentaryCtrl.updateCommentary );
api.route('/new/commentary')
    .get( MiddlewareAuth.isAuth, CommentaryCtrl.getNewCommentaries );
api.route('/new/commentary/withoutanswer')
    .get( MiddlewareAuth.isAuth, CommentaryCtrl.getCommentariesWithoutAnswer );

// Answers
api.route('/new/answer')
    .get( MiddlewareAuth.isAuth, CommentaryCtrl.getNewAnswers );
api.route('/old/answer')
    .get( MiddlewareAuth.isAuth, CommentaryCtrl.getOldAnswers );

export const RouterApi = api;
