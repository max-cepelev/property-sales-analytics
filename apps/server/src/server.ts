import { join } from 'node:path';
import Fastify from 'fastify';
import { fastifyCookie } from '@fastify/cookie';
import { fastifyStatic } from '@fastify/static';

import {
  authPlugin,
  configPlugin,
  corsPlugin,
  graphqlPlugin,
  prismaPlugin,
  redisPlugin,
  pothosPlugin,
  swaggerPlugin,
} from './plugins';

import {
  buildingsModule,
  citiesModule,
  complexesModule,
  developersModule,
  districtsModule,
  groupsModule,
  macroModule,
  pdfModule,
  propertiesModule,
  regionsModule,
  salesModule,
  usersModule,
  leadsModule,
} from './modules';

export default async function createServer() {
  const server = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  //plugins
  await server.register(configPlugin);
  // await server.register(httpPlugin);
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
  await server.register(authPlugin);
  await server.register(pothosPlugin);

  //modules
  await server.register(regionsModule);
  await server.register(citiesModule);
  await server.register(districtsModule);
  await server.register(groupsModule);
  await server.register(developersModule);
  await server.register(complexesModule);
  await server.register(buildingsModule);
  await server.register(usersModule);
  await server.register(salesModule);
  await server.register(propertiesModule);
  await server.register(pdfModule);
  await server.register(macroModule, { prefix: '/macro' });
  await server.register(leadsModule);

  //graphQL
  await server.register(graphqlPlugin);

  await server.ready();

  return server;
}
