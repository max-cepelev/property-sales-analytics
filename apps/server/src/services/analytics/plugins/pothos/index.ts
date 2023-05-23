import SchemaBuilder from '@pothos/core';
import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify';
import PrismaPlugin from '@pothos/plugin-prisma';
import { fastifyPlugin } from 'fastify-plugin';
import PrismaTypes from '../../types/pothos-types';
import {
  DecorType,
  PropertyClass,
  PropertyType,
  Role,
  WallMaterial,
} from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    pothos: PothosSchemaTypes.SchemaBuilder<
      PothosSchemaTypes.ExtendDefaultTypes<{
        PrismaTypes: PrismaTypes;
      }>
    >;
  }
}

export const pothosPlugin: FastifyPluginCallback = fastifyPlugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const pothos = new SchemaBuilder<{
    PrismaTypes: PrismaTypes;
  }>({
    plugins: [PrismaPlugin],
    prisma: {
      client: app.prisma,
      filterConnectionTotalCount: true,
    },
  });
  pothos.enumType(PropertyClass, {
    name: 'PropertyClass',
  });
  pothos.enumType(DecorType, {
    name: 'DecorType',
  });
  pothos.enumType(WallMaterial, {
    name: 'WallMaterial',
  });
  pothos.enumType(PropertyType, {
    name: 'PropertyType',
  });
  pothos.enumType(Role, {
    name: 'Role',
  });

  pothos.queryType({
    fields: (t) => ({
      queryTest: t.string({
        resolve: () => 'query is work',
      }),
    }),
  });
  pothos.mutationType({
    fields: (t) => ({
      mutationTest: t.string({
        resolve: () => 'mutation is work',
      }),
    }),
  });

  app.decorate('pothos', pothos);
  next();
});
