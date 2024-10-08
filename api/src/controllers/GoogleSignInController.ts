import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { prismaClient } from '../lib/prismaClient';
import { GoogleApis } from '../services/GoogleApis';

const schema = z.object({
  code: z.string().min(1),
});

export class GoogleSignInController {
  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    console.log(request.user);

    try {
      const result = schema.safeParse(request.body);

      if (!result.success) {
        return reply.status(400).send({
          error: result.error.issues,
        });
      }

      const { code } = result.data;

      //Step 1.
      const googleAccessToken = await GoogleApis.getAccessToken({
        code,
        redirectUri: 'http://localhost:5173/callbacks/google',
      });

      //Step 2.
      const { verifiedEmail, ...userinfo } =
        await GoogleApis.getUserInfo(googleAccessToken);

      //revoke token
      await GoogleApis.revokeAccessToken(googleAccessToken);

      if (!verifiedEmail) {
        return reply.status(401).send({
          error: 'Google account is not verified.',
        });
      }

      const user = await prismaClient.user.upsert({
        where: {
          email: userinfo.email,
        },
        create: userinfo,
        update: {
          googleId: userinfo.googleId,
        },
      });

      const accessToken = await reply.jwtSign({ sub: user.id });


      return reply.code(200).send({ accessToken });
    } catch (error) {
      console.log(error, 'deu ruim aqui!');
    }
  };
}
