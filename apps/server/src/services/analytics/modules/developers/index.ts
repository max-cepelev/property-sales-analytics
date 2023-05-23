import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';

export const developersModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const builder = app.pothos;
  builder.prismaObject('Developer', {
    fields: (t) => ({
      id: t.exposeInt('id'),
      name: t.exposeString('name'),
      fullName: t.exposeString('fullName'),
      legalAddress: t.string({
        nullable: true,
        resolve: ({ legalAddress }) => legalAddress,
      }),
      actualAddress: t.string({
        nullable: true,
        resolve: ({ actualAddress }) => actualAddress,
      }),
      inn: t.exposeString('inn'),
      kpp: t.string({
        nullable: true,
        resolve: ({ kpp }) => kpp,
      }),
      ogrn: t.string({
        nullable: true,
        resolve: ({ ogrn }) => ogrn,
      }),
      manager: t.string({
        nullable: true,
        resolve: ({ manager }) => manager,
      }),
      website: t.string({
        nullable: true,
        resolve: ({ website }) => website,
      }),
      phone: t.string({
        nullable: true,
        resolve: ({ phone }) => phone,
      }),
      email: t.string({
        nullable: true,
        resolve: ({ email }) => email,
      }),
      info: t.string({
        nullable: true,
        resolve: ({ info }) => info,
      }),
      groupId: t.exposeInt('groupId'),
      group: t.relation('group'),
      buildings: t.relation('buildings'),
    }),
  });

  const DeveloperInput = builder.inputType('DeveloperInput', {
    fields: (t) => ({
      id: t.int({ required: false }),
      name: t.string({ required: true }),
      fullName: t.string({ required: true }),
      legalAddress: t.string(),
      actualAddress: t.string(),
      inn: t.string({ required: true }),
      kpp: t.string(),
      ogrn: t.string(),
      manager: t.string(),
      website: t.string(),
      phone: t.string(),
      email: t.string(),
      info: t.string(),
      groupId: t.int({ required: true }),
    }),
  });

  builder.queryField('developers', (t) =>
    t.prismaField({
      type: ['Developer'],
      args: {
        groupId: t.arg({ type: 'Int', required: false }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.developer.findMany({
          ...query,
          where: { groupId: args.groupId ?? undefined },
        }),
    }),
  );

  builder.queryField('developer', (t) =>
    t.prismaField({
      type: 'Developer',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) =>
        await app.prisma.developer.findUnique({ where: { id: args.id } }),
    }),
  );

  builder.mutationField('createDeveloper', (t) =>
    t.prismaField({
      type: 'Developer',
      args: {
        input: t.arg({ type: DeveloperInput, required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.developer.create({
          data: { ...args.input, id: args.input.id ?? undefined },
        }),
    }),
  );

  builder.mutationField('updateDeveloper', (t) =>
    t.prismaField({
      type: 'Developer',
      args: {
        id: t.arg({ type: 'Int', required: true }),
        input: t.arg({ type: DeveloperInput, required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const developer = await app.prisma.developer.update({
          data: { ...args.input, id: args.input.id ?? undefined },
          where: { id: args.id },
        });
        if (developer) {
          return developer;
        }
        return null;
      },
    }),
  );

  builder.mutationField('deleteDeveloper', (t) =>
    t.prismaField({
      type: 'Developer',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const developer = await app.prisma.developer.delete({
          where: { id: args.id },
        });
        if (developer) {
          return developer;
        }
        return null;
      },
    }),
  );

  next();
});
