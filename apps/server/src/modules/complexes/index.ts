import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';

export const complexesModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const builder = app.pothos;
  builder.prismaObject('Complex', {
    fields: (t) => ({
      id: t.exposeInt('id'),
      name: t.exposeString('name'),
      shortName: t.string({
        nullable: true,
        resolve: ({ shortName }) => shortName,
      }),
      website: t.string({
        nullable: true,
        resolve: ({ website }) => website,
      }),
      info: t.string({
        nullable: true,
        resolve: ({ info }) => info,
      }),
      domRfId: t.int({
        nullable: true,
        resolve: ({ domRfId }) => domRfId,
      }),
      domClickId: t.int({
        nullable: true,
        resolve: ({ domClickId }) => domClickId,
      }),
      groupId: t.exposeInt('groupId'),
      cityId: t.exposeInt('cityId'),
      districtId: t.exposeInt('districtId'),
      group: t.relation('group'),
      city: t.relation('city'),
      district: t.relation('district'),
      buildigs: t.relation('buildings'),
    }),
  });

  const ComplexInput = builder.inputType('ComplexInput', {
    fields: (t) => ({
      id: t.int({ required: false }),
      name: t.string({ required: true }),
      shortName: t.string(),
      website: t.string(),
      info: t.string(),
      domRfId: t.int(),
      domClickId: t.int(),
      groupId: t.int({ required: true }),
      cityId: t.int({ required: true }),
      districtId: t.int({ required: true }),
    }),
  });

  builder.queryField('complexes', (t) =>
    t.prismaField({
      type: ['Complex'],
      args: {
        groupId: t.arg({ type: 'Int', required: false }),
        cityId: t.arg({ type: 'Int', required: false }),
        districtId: t.arg({ type: 'Int', required: false }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.complex.findMany({
          ...query,
          where: {
            groupId: args.groupId ?? undefined,
            cityId: args.cityId ?? undefined,
            districtId: args.districtId ?? undefined,
          },
        }),
    }),
  );

  builder.queryField('complex', (t) =>
    t.prismaField({
      type: 'Complex',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) =>
        await app.prisma.complex.findUnique({
          where: { id: args.id },
          ...query,
        }),
    }),
  );

  builder.mutationField('createComplex', (t) =>
    t.prismaField({
      type: 'Complex',
      args: {
        input: t.arg({ type: ComplexInput, required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.complex.create({
          data: { ...args.input, id: undefined },
        }),
    }),
  );

  builder.mutationField('updateComplex', (t) =>
    t.prismaField({
      type: 'Complex',
      args: {
        id: t.arg({ type: 'Int', required: true }),
        input: t.arg({ type: ComplexInput, required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const complex = await app.prisma.complex.update({
          data: { ...args.input, id: args.input.id ?? undefined },
          where: { id: args.id },
        });
        if (complex) {
          return complex;
        }
        return null;
      },
    }),
  );

  builder.mutationField('deleteComplex', (t) =>
    t.prismaField({
      type: 'Complex',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const complex = await app.prisma.complex.delete({
          where: { id: args.id },
        });
        if (complex) {
          return complex;
        }
        return null;
      },
    }),
  );

  next();
});
