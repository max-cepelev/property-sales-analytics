import { fastifyEnv, FastifyEnvOptions } from '@fastify/env';
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
      IS_PROD: boolean;
      TELEGRAM_BOT: string;
      OPENAI_KEY: string;
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
    required: [
      'PORT',
      'DB_URL',
      'COOKIES_SECRET',
      'JWT_SECRET',
      'TELEGRAM_BOT',
      'OPENAI_KEY',
    ],
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
      TELEGRAM_BOT: {
        type: 'string',
      },
      OPENAI_KEY: {
        type: 'string',
      },
      IS_PROD: {
        type: 'boolean',
        default: false,
      },
    },
  };

  const configOptions: FastifyEnvOptions = {
    // decorate the Fastify server instance with `config` key
    // such as `fastify.config('PORT')
    confKey: 'config',
    // schema to validate
    schema: schema,
    // source for the configuration data
    data: { ...process.env, IS_PROD: env === 'production' },
    // will read .env in root folder
    dotenv: {
      path,
      debug: true,
    },
  };

  return fastifyEnv(app, configOptions, next);
});
