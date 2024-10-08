import { FastifyReply, FastifyRequest } from 'fastify';
import { prismaClient } from '../lib/prismaClient';

export class UserController {
  static me = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await prismaClient.user.findUnique({
      where: {
        id: request.user.sub,
      },
    });

    return reply.code(200).send({
      ...user
    });
  };
}
