/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */

const usersRoot = 'users';

const v1 = '/api/v1';

export const routesV1 = {
  version: v1,
  user: {
    root: usersRoot,
    delete: `/${usersRoot}/:id`,
  },
  auth: {
    root: 'auth',
    refreshToken: '/auth/refresh',
  },
  product: {
    root: 'products',
  },
};
