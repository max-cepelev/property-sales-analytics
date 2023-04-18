import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';

export const districtsModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const builder = app.pothos;
  builder.prismaObject('District', {
    fields: (t) => ({
      id: t.exposeInt('id'),
      name: t.exposeString('name'),
      cityId: t.exposeInt('cityId'),
      city: t.relation('city'),
      buildings: t.relation('buildings'),
      complexes: t.relation('complexes'),
    }),
  });

  const DistrictInput = builder.inputType('DistrictInput', {
    fields: (t) => ({
      name: t.string({ required: true }),
      cityId: t.int({ required: true }),
    }),
  });

  builder.queryField('districts', (t) =>
    t.prismaField({
      type: ['District'],
      args: {
        cityId: t.arg({ type: 'Int', required: false }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.district.findMany({
          ...query,
          where: { cityId: args.cityId ?? undefined },
        }),
    }),
  );

  builder.queryField('district', (t) =>
    t.prismaField({
      type: 'District',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) =>
        await app.prisma.district.findUnique({
          ...query,
          where: { id: args.id },
        }),
    }),
  );

  builder.mutationField('createDistrict', (t) =>
    t.prismaField({
      type: 'District',
      args: {
        input: t.arg({ type: DistrictInput, required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.district.create({ data: args.input }),
    }),
  );

  builder.mutationField('updateDistrict', (t) =>
    t.prismaField({
      type: 'District',
      args: {
        id: t.arg({ type: 'Int', required: true }),
        input: t.arg({ type: DistrictInput, required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const district = await app.prisma.district.update({
          data: args.input,
          where: { id: args.id },
        });
        if (district) {
          return district;
        }
        return null;
      },
    }),
  );

  builder.mutationField('deleteDistrict', (t) =>
    t.prismaField({
      type: 'District',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const district = await app.prisma.district.delete({
          where: { id: args.id },
        });
        if (district) {
          return district;
        }
        return null;
      },
    }),
  );

  next();
});
