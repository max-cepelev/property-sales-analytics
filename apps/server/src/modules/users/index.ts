import { Role } from '@prisma/client';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';

export const usersModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  app.pothos.prismaObject('User', {
    fields: (t) => ({
      id: t.exposeInt('id'),
      email: t.exposeString('email'),
      // password: t.exposeString('password'),
      phone: t.string({
        resolve: (user) => user.phone || 'не задан',
      }),
      role: t.field({ type: Role, resolve: ({ role }) => role }),
      name: t.string({
        resolve: (user) => user.name || 'не задано',
      }),
      activated: t.boolean({
        resolve: (user) => user.activated || false,
      }),
    }),
  });

  app.pothos.queryFields((t) => ({
    user: t.prismaField({
      type: 'User',
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.user.findUniqueOrThrow({
          ...query,
          where: { id: args.id },
        }),
    }),
  }));

  app.pothos.queryField('users', (t) =>
    t.prismaField({
      type: ['User'],
      resolve: async () => await app.prisma.user.findMany(),
    }),
  );

  app.pothos.mutationField('deactivateUser', (t) =>
    t.prismaField({
      type: 'User',
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.user.update({
          data: { activated: false },
          where: { id: args.id },
        }),
    }),
  );

  app.pothos.mutationField('activateUser', (t) =>
    t.prismaField({
      type: 'User',
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.user.update({
          data: { activated: true },
          where: { id: args.id },
        }),
    }),
  );

  next();
});
