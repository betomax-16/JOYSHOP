import * as express from 'express';
import { MiddlewareAuth } from '../middlewares/auth';
import { UsuarioCtrl } from '../controllers/user';
import { ProductoCtrl } from '../controllers/product';

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
api.route('/search')
    .get( ProductoCtrl.search );

export const RouterApi = api;
