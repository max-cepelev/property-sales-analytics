import { fastifyCors } from '@fastify/cors';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';

export const corsPlugin = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  app.register(fastifyCors, {
    origin: [
      'https://permnovostroy.ru',
      'https://price-ostrovskogo.permnovostroy.ru',
      'https://gorod-mechty.permnovostroy.ru',
      'https://price-skvortsy.permnovostroy.ru',
      'https://price-tango.permnovostroy.ru',
      'https://price-family.permnovostroy.ru',
      'https://price-vse-svoi.permnovostroy.ru',
      'https://domnamaloy.permnovostroy.ru',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  next();
});
