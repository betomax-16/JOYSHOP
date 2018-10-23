import { environment } from '../../environments/environment';
const jwt = require('jwt-simple');
const moment = require('moment');

function createToken(user) {
  const payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };

  return jwt.encode(payload, environment.SECRET_TOKEN);
}

function decodeToken(token) {
  const decode = new Promise((resolve, reject) => {
    try {

      const payload = jwt.decode(token, environment.SECRET_TOKEN);

      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'Token expired.'
        });
      }
      resolve(payload.sub);
    } catch (e) {
      reject({
        status: 500,
        message: e.message
      });
    }
  });

  return decode;
}

export const TokenService = {
    createToken,
    decodeToken
};
