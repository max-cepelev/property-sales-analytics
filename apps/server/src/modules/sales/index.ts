import { PropertyClass, PropertyType } from '@prisma/client';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';
import { SalesService } from './sales.service';
import { SalesTypeBuilder } from './sales-type-builder';

export const salesModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const builder = app.pothos;
  const salesService = new SalesService(app.prisma);
  const types = new SalesTypeBuilder(app);

  builder.queryField('sales', (t) =>
    t.prismaField({
      type: ['Sale'],
      args: {
        buildingId: t.arg({ type: 'Int', required: false }),
        propertyType: t.arg({ type: PropertyType, required: false }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.sale.findMany({
          ...query,
          where: {
            buildingId: args.buildingId ?? undefined,
            propertyType: args.propertyType ?? undefined,
          },
        }),
    }),
  );

  builder.queryField('salesSumByPropertyType', (t) =>
    t.field({
      type: types.salesSumByPropertyType,
      args: {
        buildingIds: t.arg({ type: ['Int'], required: true }),
        propertyClass: t.arg({ type: PropertyClass, required: false }),
        districtId: t.arg({ type: 'Int', required: false }),
      },
      resolve: async (root, args) =>
        await salesService.getSalesSumByBuildingId({
          buildingIds: args.buildingIds,
          propertyClass: args.propertyClass ?? undefined,
          districtId: args.districtId ?? undefined,
        }),
    }),
  );

  builder.queryField('salesAnalytics', (t) =>
    t.field({
      type: [types.salesAnalyticsResponse],
      args: {
        propertyType: t.arg({ type: PropertyType, required: true }),
        buildingIds: t.arg({ type: ['Int'], required: false }),
        propertyClass: t.arg({ type: PropertyClass, required: false }),
        districtId: t.arg({ type: 'Int', required: false }),
      },
      resolve: async (root, args) =>
        await salesService.getSalesAnalytics({
          propertyType: args.propertyType,
          propertyClass: args.propertyClass ?? undefined,
          buildingIds: args.buildingIds ?? undefined,
          districtId: args.districtId ?? undefined,
        }),
    }),
  );

  builder.queryField('salesData', (t) =>
    t.field({
      type: types.salesDataResponse,
      args: {
        propertyType: t.arg({ type: PropertyType, required: true }),
        year: t.arg({ type: 'Int', required: true }),
        month: t.arg({ type: 'Int', required: true }),
        propertyClass: t.arg({ type: PropertyClass, required: false }),
        districtId: t.arg({ type: 'Int', required: false }),
        favorites: t.arg({ type: ['Int'], required: false }),
      },
      resolve: async (root, args) =>
        await salesService.getSalesDataByGroups({
          propertyType: args.propertyType,
          year: args.year,
          month: args.month,
          propertyClass: args.propertyClass ?? undefined,
          districtId: args.districtId ?? undefined,
          favorites: args.favorites ?? undefined,
        }),
    }),
  );

  builder.mutationField('saveSales', (t) =>
    t.prismaField({
      type: ['Sale'],
      args: {
        input: t.arg({ type: [types.saleInput], required: true }),
      },
      resolve: async (query, root, args) => {
        const response = [];
        for await (const sale of args.input) {
          const id = sale.id;
          const res = id
            ? await app.prisma.sale.update({
                where: { id },
                data: { ...sale, id },
              })
            : await app.prisma.sale.create({
                data: { ...sale, id: undefined },
              });
          if (res) {
            response.push(res);
          }
        }
        return response;
      },
    }),
  );

  builder.mutationField('deleteSale', (t) =>
    t.prismaField({
      type: 'Sale',
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) =>
        await app.prisma.sale.delete({
          where: { id: args.id },
        }),
    }),
  );

  next();
});
