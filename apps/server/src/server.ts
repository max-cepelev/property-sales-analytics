import { join } from 'node:path';
import Fastify from 'fastify';
// import { fastifyHelmet } from '@fastify/helmet';
import { fastifyCookie } from '@fastify/cookie';
import { fastifyStatic } from '@fastify/static';

import {
  configPlugin,
  corsPlugin,
  prismaPlugin,
  redisPlugin,
  swaggerPlugin,
} from './plugins';
import { authService } from './services/auth';
import { macroService } from './services/macro';
import { leadsService } from './services/leads';
import { gptBotService } from './services/gpt-bot';
import { analyticsService } from './services/analytics';

export default async function createServer() {
  const server = Fastify({
    disableRequestLogging: process.env.NODE_ENV === 'production',
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
          ignore: 'pid, hostname',
        },
      },
    },
  });

  //plugins
  await server.register(configPlugin);
  // await server.register(fastifyHelmet, { global: true });
  await server.register(redisPlugin);
  await server.register(corsPlugin);
  await server.register(fastifyStatic, {
    root: join(__dirname, 'public'),
    // prefix: '/public/', // optional: default '/'
  });
  await server.register(fastifyCookie, {
    secret: server.config.COOKIES_SECRET,
  });
  await server.register(prismaPlugin);
  await server.register(swaggerPlugin);
  await server.register(authService);

  //services
  // await server.register(pdfModule);
  await server.register(analyticsService);
  await server.register(macroService, { prefix: '/macro' });
  await server.register(leadsService);
  await server.register(gptBotService);

  await server.ready();

  return server;
}
