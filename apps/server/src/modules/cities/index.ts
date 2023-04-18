import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';

export const citiesModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const builder = app.pothos;
  builder.prismaObject('City', {
    fields: (t) => ({
      id: t.exposeInt('id'),
      name: t.exposeString('name'),
      regionId: t.exposeInt('regionId'),
      region: t.relation('region'),
    }),
  });

  const CityInput = builder.inputType('CityInput', {
    fields: (t) => ({
      name: t.string({ required: true }),
      regionId: t.int({ required: true }),
    }),
  });

  builder.queryField('cities', (t) =>
    t.prismaField({
      type: ['City'],
      args: {
        regionId: t.arg({ type: 'Int', required: false }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.city.findMany({
          ...query,
          where: { regionId: args.regionId ?? undefined },
        }),
    }),
  );

  builder.queryField('city', (t) =>
    t.prismaField({
      type: 'City',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) =>
        await app.prisma.city.findUnique({ where: { id: args.id }, ...query }),
    }),
  );

  builder.mutationField('createCity', (t) =>
    t.prismaField({
      type: 'City',
      args: {
        input: t.arg({ type: CityInput, required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.city.create({ data: args.input }),
    }),
  );

  builder.mutationField('updateCity', (t) =>
    t.prismaField({
      type: 'City',
      args: {
        id: t.arg({ type: 'Int', required: true }),
        input: t.arg({ type: CityInput, required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const city = await app.prisma.city.update({
          data: args.input,
          where: { id: args.id },
        });
        if (city) {
          return city;
        }
        return null;
      },
    }),
  );

  builder.mutationField('deleteCity', (t) =>
    t.prismaField({
      type: 'City',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const city = await app.prisma.city.delete({ where: { id: args.id } });
        if (city) {
          return city;
        }
        return null;
      },
    }),
  );

  next();
});
