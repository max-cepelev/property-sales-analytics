import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import plugin from 'fastify-plugin';
import { fastifyJwt } from '@fastify/jwt';
import { fastifyAuth } from '@fastify/auth';
import {
  AuthResponse,
  AUTH_RESPONSE_SCHEMA,
  LoginInput,
  LOGIN_SCHEMA,
  RegistrationInput,
  REGISTRATION_SCHEMA,
  JwtPayload,
} from './auth.schema';
import { CookieSerializeOptions } from '@fastify/cookie';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { AuthService } from './auth.service';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

export const authPlugin = plugin(async function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const cookiesOptions: CookieSerializeOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
    path: '/',
  };

  await app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
  });
  await app.register(fastifyAuth);

  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({ message: 'Unauthorized' });
      }
    },
  );

  const service = new AuthService(app);

  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/signup',
    {
      schema: {
        tags: ['Authorization'],
        body: REGISTRATION_SCHEMA,
        response: {
          200: AUTH_RESPONSE_SCHEMA,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: RegistrationInput;
        Reply: AuthResponse | { message: string };
      }>,
      reply,
    ) => {
      try {
        const { user, token, refreshToken } = await service.registration(
          request.body,
        );
        reply
          .setCookie('refreshToken', refreshToken, cookiesOptions)
          .send({ user, token });
      } catch (error: any) {
        reply.status(401).send({ message: error.message });
      }
    },
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/login',
    {
      schema: {
        tags: ['Authorization'],
        body: LOGIN_SCHEMA,
        response: {
          200: AUTH_RESPONSE_SCHEMA,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: LoginInput;
        Reply: AuthResponse | { message: string };
      }>,
      reply,
    ) => {
      try {
        const { refreshToken, token, user } = await service.login(request.body);
        reply.setCookie('refreshToken', refreshToken, cookiesOptions).send({
          token,
          user,
        });
      } catch (error: any) {
        reply.status(401).send({ message: error.message });
      }
    },
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/auth/refresh',
    {
      schema: {
        tags: ['Authorization'],
        response: {
          200: AUTH_RESPONSE_SCHEMA,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: RegistrationInput;
        Reply: AuthResponse | { message: string };
      }>,
      reply,
    ) => {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        reply.status(401).send({ message: 'Unauthorized' });
        return;
      }
      try {
        const { newRefreshToken, token, user } = await service.refresh(
          refreshToken,
        );

        reply
          .setCookie('refreshToken', newRefreshToken, cookiesOptions)
          .send({ user, token });
      } catch (err: any) {
        reply.status(401).send({ message: err.message });
      }
    },
  );

  app.get(
    '/auth/logout',
    {
      schema: {
        tags: ['Authorization'],
      },
    },
    async (request, reply) => {
      reply
        .clearCookie('refreshToken', { path: '/' })
        .send({ message: 'Logged out' });
    },
  );

  app.get(
    '/protected',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Test'],
      },
    },
    async (request, reply) => {
      reply.send(request.user);
    },
  );

  next();
});
