// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular.json`.

export const environment = {
  production: false,
  MongoDB: 'mongodb://admin:calico&12@ds053139.mlab.com:53139/joyshop',
  SECRET_TOKEN: 'token'
};
