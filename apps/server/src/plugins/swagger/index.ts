import { fastifySwagger } from '@fastify/swagger';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import fastifySwaggerUI from '@fastify/swagger-ui';

export const swaggerPlugin = fastifyPlugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'SampleApi',
        description: 'Sample backend service',
        version: '1.0.0',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
    // You can also create transform with custom skiplist of endpoints that should not be included in the specification:
    //
    // transform: createJsonSchemaTransform({
    //   skipList: [ '/documentation/static/*' ]
    // })
  });

  app.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
  });

  next();
});
