import { FastifyInstance } from 'fastify';

import { GoogleSignInController } from './controllers/GoogleSignInController';
import { UserController } from './controllers/UserController';
import { authMiddleware } from './middlewares/authMiddleware';

export async function publicRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/google', GoogleSignInController.handle);
}

export async function privateRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authMiddleware);

  fastify.get('/me',  UserController.me);
}
