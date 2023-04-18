import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';
import { fastifyRedis } from '@fastify/redis';

export const redisPlugin = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  app.register(fastifyRedis, {
    host: '127.0.0.1',
    // password: 'frai2912',
    port: 6379, // Redis port
    family: 4, // 4 (IPv4) or 6 (IPv6)
  });

  // app.get('/redis', (req: FastifyRequest, reply) => {
  //   const { redis } = app;
  //   redis.get('fff', (err, val) => {
  //     reply.send(err || val);
  //   });
  // });

  // app.post(
  //   '/redis',
  //   (req: FastifyRequest<{ Body: { value: string } }>, reply) => {
  //     const { redis } = app;
  //     redis.set('fff', req.body.value, (err) => {
  //       reply.send(err || { status: 'ok' });
  //     });
  //   },
  // );

  next();
});
