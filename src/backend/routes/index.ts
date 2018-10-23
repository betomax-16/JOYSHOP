import * as express from 'express';
import { MiddlewareAuth } from '../middlewares/auth';
import { UsuarioCtrl } from '../controllers/user';

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

export const RouterApi = api;
