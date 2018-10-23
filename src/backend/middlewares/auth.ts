import { TokenService } from '../services/tokenService';
import { FormatError } from '../models/formarError';

function isAuth(req, res, next) {
  const errors: Array<FormatError> = [];
  if (!req.headers.authorization) {
    errors.push(new FormatError('Authorization', 'You are not authorized.'));
    return res.status(403).send({errors});
  }

  const token = req.headers.authorization;

  TokenService.decodeToken(token)
    .then(response => {
      req.user = response;
      next();
    })
    .catch(response => {
      errors.push(new FormatError('Authorization', response.message));
      res.status(response.status).send({errors});
    });
}

export const MiddlewareAuth = { isAuth };
