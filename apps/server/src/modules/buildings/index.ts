import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';
import { BuildingSchemaBuilder } from './building.schema';

export const buildingsModule = plugin(function (
  app: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void,
) {
  const builder = app.pothos;

  const schemas = new BuildingSchemaBuilder(app);

  const Building = schemas.getBuildingSchema();

  const BuildingForMap = schemas.getBuildingForMapSchema();

  const BuildingInput = schemas.getBuildingInput();

  builder.queryField('buildings', (t) =>
    t.prismaField({
      type: [Building],
      args: {
        groupId: t.arg({ type: 'Int', required: false }),
        complexId: t.arg({ type: 'Int', required: false }),
        cityId: t.arg({ type: 'Int', required: false }),
        districtId: t.arg({ type: 'Int', required: false }),
        completed: t.arg({ type: 'Boolean', required: false }),
      },
      resolve: async (query, root, args) => {
        const { groupId, cityId, completed, complexId, districtId } = args;
        const buildings = await app.prisma.building.findMany({
          ...query,
          where: {
            groupId: groupId ?? undefined,
            cityId: cityId ?? undefined,
            completed: completed ?? undefined,
            complexId: complexId ?? undefined,
            districtId: districtId ?? undefined,
          },
          orderBy: [{ name: 'asc' }],
        });

        return buildings;
      },
    }),
  );

  builder.queryField('buildingsForMap', (t) =>
    t.field({
      type: [BuildingForMap],
      resolve: async () => {
        const response = app.prisma.building
          .findMany({
            where: { latitude: { not: null }, longitude: { not: null } },
            select: {
              id: true,
              name: true,
              propertyClass: true,
              latitude: true,
              longitude: true,
              complex: {
                select: {
                  name: true,
                },
              },
            },
          })
          .then((res) =>
            res.map((item) => ({
              id: item.id,
              name: item.name,
              propertyClass: item.propertyClass,
              latitude: item.latitude || 0,
              longitude: item.longitude || 0,
              complexName: item.complex.name,
            })),
          );
        return response;
      },
    }),
  );

  builder.queryField('building', (t) =>
    t.prismaField({
      type: Building,
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const building = await app.prisma.building.findUnique({
          where: { id: args.id },
          ...query,
        });
        return building;
      },
    }),
  );

  builder.mutationField('createBuilding', (t) =>
    t.prismaField({
      type: Building,
      args: {
        input: t.arg({ type: BuildingInput, required: true }),
      },
      resolve: async (query, root, args) =>
        await app.prisma.building.create({
          data: { ...args.input, id: undefined },
        }),
    }),
  );

  builder.mutationField('updateBuilding', (t) =>
    t.prismaField({
      type: Building,
      args: {
        id: t.arg({ type: 'Int', required: true }),
        input: t.arg({ type: BuildingInput, required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const building = await app.prisma.building.update({
          data: { ...args.input, id: args.id },
          where: { id: args.id },
        });
        if (building) {
          return building;
        }
        return null;
      },
    }),
  );

  builder.mutationField('deleteBuilding', (t) =>
    t.prismaField({
      type: Building,
      args: {
        id: t.arg({ type: 'Int', required: true }),
      },
      nullable: true,
      resolve: async (query, root, args) => {
        const building = await app.prisma.building.delete({
          where: { id: args.id },
        });
        if (building) {
          return building;
        }
        return null;
      },
    }),
  );

  next();
});
