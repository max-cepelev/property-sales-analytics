import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';

export const groupsModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const builder = app.pothos;
  builder.prismaObject('Group', {
    fields: (t) => ({
      id: t.exposeInt('id'),
      name: t.exposeString('name'),
      regions: t.relation('regions'),
    }),
  });

  builder.queryField('groups', (t) =>
    t.prismaField({
      type: ['Group'],
      resolve: async (query) =>
        await app.prisma.group.findMany({
          ...query,
        }),
    }),
  );

  builder.queryField('group', (t) =>
    t.prismaField({
      type: 'Group',
      nullable: true,
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.group.findUnique({
          ...query,
          where: { id: args.id },
        }),
    }),
  );

  builder.mutationField('createGroup', (t) =>
    t.prismaField({
      type: 'Group',
      args: {
        name: t.arg({ type: 'String', required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.group.create({ data: { name: args.name } }),
    }),
  );

  builder.mutationField('updateGroup', (t) =>
    t.prismaField({
      type: 'Group',
      args: {
        id: t.arg({ type: 'Int', required: true }),
        name: t.arg({ type: 'String', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const group = await app.prisma.group.update({
          data: { name: args.name },
          where: { id: args.id },
        });
        if (group) {
          return group;
        }
        return null;
      },
    }),
  );

  builder.mutationField('deleteGroup', (t) =>
    t.prismaField({
      type: 'Group',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const group = await app.prisma.group.delete({ where: { id: args.id } });
        if (group) {
          return group;
        }
        return null;
      },
    }),
  );

  next();
});
