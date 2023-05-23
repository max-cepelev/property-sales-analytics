import { fastifyCors } from '@fastify/cors';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

export const corsPlugin = fastifyPlugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const origin = [
    'https://permnovostroy.ru',
    'https://price-ostrovskogo.permnovostroy.ru',
    'https://gorod-mechty.permnovostroy.ru',
    'https://price-skvortsy.permnovostroy.ru',
    'https://price-tango.permnovostroy.ru',
    'https://price-family.permnovostroy.ru',
    'https://price-vse-svoi.permnovostroy.ru',
    'https://domnamaloy.permnovostroy.ru',
  ];

  if (!app.config.IS_PROD) {
    origin.push('http://localhost:3001');
  }
  app.register(fastifyCors, {
    origin,
    credentials: true,
  });

  next();
});
