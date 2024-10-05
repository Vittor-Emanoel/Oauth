import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { GoogleApis } from '../services/GoogleApis';

const schema = z.object({
  code: z.string().min(1),
});

export class GoogleSignInController {
  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: result.error.issues,
      });
    }

    const {code} = result.data;

    //Step 1.
    const {accessToken} = await GoogleApis.getAccessToken({
      code,
      redirectUri: 'http://localhost:5173/callbacks/google'
    });

    //Step 2.
    const userinfo = await GoogleApis.getUserInfo(accessToken);

    //revoke token
    await GoogleApis.revokeAccessToken(accessToken);

    if(!userinfo.verifiedEmail) {
      return reply.status(401).send({
        error: 'Google account is not verified.'
      });
    }


    return reply.code(200).send({ google: true });
  };
}
