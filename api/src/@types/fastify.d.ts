//learn more: https://github.com/fastify/fastify-jwt

import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT  {
    user: {
      sub: string;
      iat: number;
      exp: number;
    };
  }
}
