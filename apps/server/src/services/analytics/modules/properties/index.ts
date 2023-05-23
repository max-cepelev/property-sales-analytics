import { PropertyClass, PropertyType } from '@prisma/client';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';
import { PropertiesService } from './properties.service';
import { PropertiesTypesBuilder } from './properties-types-builder';

export const propertiesModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const builder = app.pothos;

  const service = new PropertiesService(app.prisma);

  const types = new PropertiesTypesBuilder(app);

  builder.queryField('properties', (t) =>
    t.prismaField({
      type: ['Property'],
      args: {
        buildingId: t.arg({ type: 'Int', required: false }),
        propertyType: t.arg({ type: PropertyType, required: false }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.property.findMany({
          ...query,
          where: {
            buildingId: args.buildingId ?? undefined,
            propertyType: args.propertyType ?? undefined,
          },
        }),
    }),
  );

  builder.queryField('propCounts', (t) =>
    t.field({
      type: types.propCountsType,
      args: {
        buildingId: t.arg({ type: 'Int', required: true }),
      },
      resolve: async (query, args) =>
        await service.getPropCounts(args.buildingId),
    }),
  );

  builder.queryField('propAggregate', (t) =>
    t.field({
      type: types.propAggregateResponseType,
      args: {
        buildingIds: t.arg({ type: ['Int'], required: true }),
        propertyClass: t.arg({ type: PropertyClass, required: false }),
        districtId: t.arg({ type: 'Int', required: false }),
      },
      resolve: async (query, args) =>
        await service.getPropAggregate({
          buildingIds: args.buildingIds,
          propertyClass: args.propertyClass ?? undefined,
          districtId: args.districtId ?? undefined,
        }),
    }),
  );

  builder.queryField('propRoomsAggregate', (t) =>
    t.field({
      type: types.propRoomsAggregateResponseType,
      args: {
        buildingId: t.arg({ type: 'Int', required: true }),
      },
      resolve: async (query, args) =>
        await service.getPropAggregateByRoomsAmount(args.buildingId),
    }),
  );

  builder.mutationField('updateProperties', (t) =>
    t.prismaField({
      type: ['Property'],
      args: {
        input: t.arg({ type: [types.propertyInput], required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) =>
        await service.saveProperties(args.input),
    }),
  );

  builder.mutationField('deleteProperty', (t) =>
    t.prismaField({
      type: 'Property',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) =>
        await app.prisma.property.delete({
          where: { id: args.id },
        }),
    }),
  );

  app.get('/proptest', async (request, reply) => {
    const data = await service.getPropAggregateByRoomsAmount(110);
    reply.send(data);
  });

  next();
});
