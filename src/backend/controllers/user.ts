import { User } from '../models/user';
import { FormatError } from '../models/formarError';
import { TokenService } from '../services/tokenService';
// import { UrlQueryService } from '../services/urlQueryService';
import * as  validator from 'validator';
import { EmailService } from '../services/emailService';

const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');


function validateMongoId(id: string, field: string): FormatError {
  let error: FormatError = null;
  if (!validator.isMongoId(id)) {
      error = new FormatError(field, 'It is not valid Id.');
  }
  return error;
}

function validate(req, update: boolean = false): FormatError[] {
  const errors: Array<FormatError> = [];
  const fields: Array<string> = ['name', 'lastname', 'email', 'password'];

  if (!update) {
    fields.forEach(field => {
        if (!req.body[field]) {
            errors.push(new FormatError(field, `The field ${field} can not be empty.`));
        }
    });
  } else {
      let error: FormatError;
      if (req.params.id) {
        error = validateMongoId(req.params.id, 'idUser');
      } else if (req.user) {
        error = validateMongoId(req.user, 'idUser');
      }
      if (error) {
          errors.push(error);
          return errors;
      }
  }

  // tslint:disable-next-line:triple-equals
  if (errors.length == 0) {
    // tslint:disable-next-line:forin
    for (const property in req.body) {
      // tslint:disable-next-line:triple-equals
      if (property == 'phone') {
        // tslint:disable-next-line:triple-equals
        if (typeof req.body[property] == 'string') {
          if (!validator.isMobilePhone(req.body[property], 'any')) {
            errors.push(new FormatError(property, 'Invalid phone format.'));
          }
        } else {
          errors.push(new FormatError(property, 'Invalid phone format.'));
        }
      }
      // tslint:disable-next-line:triple-equals
      if (property == 'password') {
        // tslint:disable-next-line:triple-equals
        if (typeof req.body[property] == 'string') {
          // tslint:disable-next-line:triple-equals
          if (req.body[property].trim() == '') {
            if (!update) {
              errors.push(new FormatError(property, 'The password cannot be empty.'));
            } else { delete req.body.password; }
          } else {
              const exp = / /;
              if (exp.test(req.body[property].trim())) {
                  errors.push(new FormatError(property, 'The password cannot have spaces.'));
              }
          }
          // if (!validator.isAlphanumeric(req.body[property], ['es-ES']))
        } else {
          errors.push(new FormatError(property, 'Non-alphanumeric format.'));
        }
      // tslint:disable-next-line:triple-equals
      } else if (property == 'name' || property == 'lastname') {
        // tslint:disable-next-line:triple-equals
        if (typeof req.body[property] == 'string') {
          const words: Array<string> = req.body[property].trim().split(' ');
          words.forEach(word => {
            if (!validator.isAlpha(word , ['es-ES'])) {
              return errors.push(new FormatError(property, 'Non-alphabetic format.'));
            }
          });
        } else {
          errors.push(new FormatError(property, 'Non-alphabetic format.'));
        }
      // tslint:disable-next-line:triple-equals
      } else if (property == 'birthdate') {
        // tslint:disable-next-line:triple-equals
        if (typeof req.body[property] == 'string') {
          if (!moment(req.body[property]).isValid()) {
            errors.push(new FormatError(property, 'Invalid date format.'));
          } else {
            // Edad minima
            const edad: number = moment().diff(moment(req.body[property]), 'years', true);
            if (edad < 18) {
              errors.push(new FormatError(property, 'Minimum age not met.'));
            }
          }
        } else {
          errors.push(new FormatError(property, 'Invalid date format.'));
        }
      // tslint:disable-next-line:triple-equals
      } else if (property == 'email') {
        // tslint:disable-next-line:triple-equals
        if (typeof req.body[property] == 'string') {
          if (!validator.isEmail(req.body[property])) {
            errors.push(new FormatError(property, 'Invalid email format.'));
          }
        } else {
          errors.push(new FormatError(property, 'Invalid email format.'));
        }
      // tslint:disable-next-line:triple-equals
      } else if (property == 'sex') {
        // tslint:disable-next-line:triple-equals
        if (typeof req.body[property] == 'string') {
          // tslint:disable-next-line:triple-equals
          if (req.body[property] != 'male' && req.body[property] != 'female') {
            errors.push(new FormatError(property, 'Invalid option.'));
          }
        } else {
          errors.push(new FormatError(property, 'Invalid option.'));
        }
      }
    }
  }

  return errors;
}

function createUser(req, res, errors: Array<FormatError>) {
  User.findOne({email: req.body.email}, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
      for (const property in req.body) {
        // tslint:disable-next-line:triple-equals
        if (property != 'password' && typeof req.body[property] == 'string') {
          req.body[property] = req.body[property].trim();
        }
      }
      const user = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        sex: req.body.sex,
        password: req.body.password,
        birthdate: req.body.birthdate,
        photo: req.body.photo,
        confirm: req.body.confirm
      });

      user.save((error) => {
        if (error) { return res.status(500).send({error}); }
        EmailService.SendEmail(user.email, 'Correo de confirmación', 'confirmation.html',
                            {nombre: user.name, link: getHostName(req) + '/api/confirm/' + user._id});

        return res.status(201).send({
            token: TokenService.createToken(user),
            user: user
        });
      });
    } else {
      errors.push(new FormatError('email', `Existing email.`));
      return res.status(500).send({errors});
    }
  });
}

function signUp(req, res) {
  const errors: Array<FormatError> = validate(req);
  if (errors.length > 0) {
      return res.status(500).send({errors});
  }
  return createUser(req, res, errors);
}

function signIn(req, res) {
  const errors: Array<FormatError> = [];
  if (req.body.email && req.body.password) {
    // tslint:disable-next-line:triple-equals
    if (typeof req.body.email == 'string') {
      if (!validator.isEmail(req.body.email)) {
        errors.push(new FormatError('email', 'Invalid email format.'));
      }
    } else { errors.push(new FormatError('email', 'Invalid email format.')); }
    // tslint:disable-next-line:triple-equals
    if (typeof req.body.password == 'string') {
      // tslint:disable-next-line:triple-equals
      if (req.body.password.trim() == '') {
        errors.push(new FormatError('password', 'The password cannot be empty.'));
      } else {
          const exp = / /;
          if (exp.test(req.body.password.trim())) {
              errors.push(new FormatError('password', 'The password cannot have spaces.'));
          }
      }
    } else { errors.push(new FormatError('password', 'Non-alphanumeric format.')); }
    if (errors.length > 0) { return res.status(500).send({errors}); }

    User.findOne({email: req.body.email}, (err, user) => {
      if (err) { return res.status(500).send({message: err}); }
      if (!user) { return res.status(500).send({message: 'Invalid credentials.'}); }

      bcrypt.compare(req.body.password, user.password, function(error, doesMatch) {
        if (doesMatch) {
           if (user.password) { delete user.password; }
           res.status(200).send({
              message: 'Correct authentication.',
              token: TokenService.createToken(user),
              user: user
            });
        } else {
            errors.push(new FormatError('authentication', 'Invalid credentials.'));
            return res.status(500).send({errors});
        }
      });
    });
  } else {
    errors.push(new FormatError('all', 'Empty fields.'));
    return res.status(500).send({errors});
  }
}

function confirm(req, res) {
  const idUsuario = req.params.id;
  const errors: Array<FormatError> = validate(req, true);
  if (errors.length > 0) { return res.status(500).send({errors}); }
  User.findById(idUsuario, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
      errors.push(new FormatError('idUser', 'User not found.'));
      return res.status(404).send({errors});
    }
    usuario.confirm = true;
    usuario.save((error, updatedUsuario) => {
      if (error) { return res.status(500).send({error}); }
      // Redireccionar a una pagina
      if (updatedUsuario.password) { delete updatedUsuario.password; }
      res.redirect(getHostName(req));
    });
  });
}

function passRecovery(req, res) {
  const email = req.body.email;
  const errors: Array<FormatError> = [];
  if (email) {
    // tslint:disable-next-line:triple-equals
    if (typeof req.body.email == 'string') {
      if (!validator.isEmail(req.body.email)) { errors.push(new FormatError('email', 'Invalid email format.')); }
    } else { errors.push(new FormatError('email', 'Invalid email format.')); }
  } else {
    errors.push(new FormatError('email', 'The field email can not be empty.'));
  }
  if (errors.length > 0) { return res.status(500).send({errors}); }

  User.findOne({email: email}, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
      errors.push(new FormatError('email', 'User not found.'));
      return res.status(404).send({errors});
    }
    const pass = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    usuario.password = pass;
    usuario.save((error, usuarioStored) => {
      if (error) { return res.status(500).send({error}); }
      EmailService.SendEmail(usuario.email, 'Nueva contraseña', 'nuevaContrasena.html',
                             {nombre: usuario.name, pass: pass});
      res.status(200).send({usuario: usuarioStored});
    });
  });
}

function getUser(req, res) {
  const idUsuario = req.user;
  const errors: Array<FormatError> = [];
  const error: FormatError = validateMongoId(idUsuario, 'idUser');
  if (error) { errors.push(error); }
  if (errors.length > 0) { return res.status(500).send({errors}); }
  User.findById(idUsuario, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
      errors.push(new FormatError('idUser', 'User not found.'));
      return res.status(404).send({errors});
    }
    if (usuario.password) { delete usuario.password; }
    return res.status(200).send({usuario});
  });
}

function updateUser(req, res) {
  const idUser = req.user;
  const errors: Array<FormatError> = validate(req, true);
  if (errors.length > 0) { return res.status(500).send({errors}); }
  User.findById(idUser, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
        errors.push(new FormatError('idUser', 'User not found.'));
        return res.status(404).send({errors});
    }
    for (const property in req.body) {
      // tslint:disable-next-line:triple-equals
      if (property != '_id' && property != 'confirm' && property != 'createdAt') {
            // tslint:disable-next-line:triple-equals
            if (property != 'password' && typeof req.body[property] == 'string') {
              usuario[property] = req.body[property].trim();
            } else {
              usuario[property] = req.body[property];
            }
      }
    }
    usuario.save((error, updatedUsuario) => {
        if (error) { return res.status(500).send({error}); }
        if (updatedUsuario.password) { delete updatedUsuario.password; }
        res.status(200).send({updatedUsuario});
    });
  });
}

function getUserPublic(req, res) {
  const idUsuario = req.params.id;
  const errors: Array<FormatError> = [];
  const error: FormatError = validateMongoId(idUsuario, 'idUser');
  if (error) { errors.push(error); }
  if (errors.length > 0) { return res.status(500).send({errors}); }
  User.findById(idUsuario, (err, usuario) => {
    if (err) { return res.status(500).send({err}); }
    if (!usuario) {
      errors.push(new FormatError('idUser', 'User not found.'));
      return res.status(404).send({errors});
    }
    if (usuario.password) { delete usuario.password; }
    return res.status(200).send({usuario});
  });
}

function getHostName(req) {
  const PORT = process.env.PORT || 4000;
  const host = `${req.protocol}://${req.hostname}:${PORT}`;
  return host;
}

export const UsuarioCtrl = {
  signUp,
  signIn,
  confirm,
  passRecovery,
  getUser,
  updateUser,
  getUserPublic
};
