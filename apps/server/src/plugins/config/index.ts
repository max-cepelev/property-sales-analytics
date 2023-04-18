import fastifyEnv from '@fastify/env';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { join } from 'node:path';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      DB_URL: string;
      COOKIES_SECRET: string;
      JWT_SECRET: string;
    };
  }
}

export const configPlugin = fastifyPlugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const env: string | undefined = process.env.NODE_ENV;
  const path = join(process.cwd(), env ? `${env}.env` : 'development.env');
  const schema = {
    type: 'object',
    required: ['PORT', 'DB_URL', 'COOKIES_SECRET', 'JWT_SECRET'],
    properties: {
      PORT: {
        type: 'number',
        default: 3000,
      },
      DB_URL: {
        type: 'string',
      },
      COOKIES_SECRET: {
        type: 'string',
      },
      JWT_SECRET: {
        type: 'string',
      },
    },
  };

  const configOptions = {
    // decorate the Fastify server instance with `config` key
    // such as `fastify.config('PORT')
    confKey: 'config',
    // schema to validate
    schema: schema,
    // source for the configuration data
    data: process.env,
    // will read .env in root folder
    dotenv: {
      path,
      debug: true,
    },
    // will remove the additional properties
    // from the data object which creates an
    // explicit schema
    removeAdditional: true,
  };

  return fastifyEnv(app, configOptions, next);
});
