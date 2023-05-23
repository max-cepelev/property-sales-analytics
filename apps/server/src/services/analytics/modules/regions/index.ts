import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';

export const regionsModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const builder = app.pothos;
  builder.prismaObject('Region', {
    fields: (t) => ({
      id: t.exposeInt('id'),
      name: t.exposeString('name'),
      groups: t.relation('groups'),
    }),
  });

  const RegionInput = builder.inputType('RegionInput', {
    fields: (t) => ({
      name: t.string({ required: true }),
      groups: t.intList({ required: false }),
    }),
  });

  builder.queryField('regions', (t) =>
    t.prismaField({
      type: ['Region'],
      resolve: async (query) =>
        await app.prisma.region.findMany({
          ...query,
        }),
    }),
  );

  builder.mutationField('createRegion', (t) =>
    t.prismaField({
      type: 'Region',
      args: {
        input: t.arg({ type: RegionInput, required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.region.create({
          data: {
            name: args.input.name,
            groups: {
              connect: args.input.groups?.map((item) => ({ id: item })),
            },
          },
        }),
    }),
  );

  builder.mutationField('updateRegion', (t) =>
    t.prismaField({
      type: 'Region',
      args: {
        id: t.arg({ type: 'Int', required: true }),
        input: t.arg({ type: RegionInput, required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const region = await app.prisma.region.update({
          data: {
            name: args.input?.name || undefined,
            groups: {
              connect: args.input.groups?.map((item) => ({ id: item })),
            },
          },
          where: { id: args.id },
        });
        if (region) {
          return region;
        }
        return null;
      },
    }),
  );

  builder.mutationField('deleteRegion', (t) =>
    t.prismaField({
      type: 'Region',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const region = await app.prisma.region.delete({
          where: { id: args.id },
        });
        if (region) {
          return region;
        }
        return null;
      },
    }),
  );

  next();
});
