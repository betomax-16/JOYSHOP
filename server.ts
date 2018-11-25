import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { environment } from './src/environments/environment';
import {enableProdMode} from '@angular/core';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
// Import Routers API
import { RouterApi } from './src/backend/routes/index';

import * as express from 'express';
import {join} from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  serveClient: false,
  wsEngine: 'ws', // uws is not supported since it is a native module
  path: '/napi'
});
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./server/main');

// Conect MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(environment.MongoDB, { useNewUrlParser: true });

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', RouterApi);
// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
server.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

// Socket io events
let usuarios = [];
io.on('connection', function(socket) {
  usuarios.push({id: socket.id, idUser: socket.handshake.query.idUser});
  console.log('a user connected');
  console.log(usuarios);

  socket.on('disconnect', function() {
    // quitar al usaurio del arreglo
    usuarios = usuarios.filter(function(usuario) {
      return usuario.id !== socket.id;
    });
    console.log('user disconnected');
  });

  // Emisión de una comentario
  socket.on('sendCommentary', (req) => {
    const usuariosAux = usuarios.filter(function(usuario) {
      return usuario.idUser === req.product.idUser;
    });
    usuariosAux.forEach(usuario => {
      // sending to individual socketid (private message)
      io.to(usuario.id).emit('getCommentary', req);
    });
  });

  // Emisión de una respuesta
  socket.on('sendAnswer', (res) => {
    const usuariosAux = usuarios.filter(function(usuario) {
      return usuario.idUser === res.idUser;
    });
    usuariosAux.forEach(usuario => {
      // sending to individual socketid (private message)
      io.to(usuario.id).emit('getAnswer', res);
    });
  });
});
