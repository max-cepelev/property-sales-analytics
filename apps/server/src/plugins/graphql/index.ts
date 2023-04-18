import fp from 'fastify-plugin';
import {
  FastifyError,
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { createYoga } from 'graphql-yoga';

export const graphqlPlugin: FastifyPluginCallback = fp(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: (error?: FastifyError) => void,
) {
  const schema = app.pothos.toSchema();
  const yoga = createYoga<{
    req: FastifyRequest;
    reply: FastifyReply;
  }>({
    schema,
    // Integrate Fastify logger
    logging: {
      debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
      info: (...args) => args.forEach((arg) => app.log.info(arg)),
      warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
      error: (...args) => args.forEach((arg) => app.log.error(arg)),
    },
  });

  app.route({
    url: '/graphql',
    schema: {
      tags: ['GraphQL'],
    },
    method: ['GET', 'POST', 'OPTIONS'],
    onRequest: [app.authenticate],
    handler: async (req, reply) => {
      // Second parameter adds Fastify's `req` and `reply` to the GraphQL Context
      const response = await yoga.handleNodeRequest(req, {
        req,
        reply,
      });
      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });

      reply.status(response.status);

      reply.send(response.body);

      return reply;
    },
  });

  // This will allow Fastify to forward multipart requests to GraphQL Yoga
  app.addContentTypeParser('multipart/form-data', {}, (req, payload, done) =>
    done(null),
  );

  next();
});
