import { FastifyInstance } from 'fastify';
import { BuildingsForMapDto } from './dto/building-for-map.dto';
import { DecorType, PropertyClass, WallMaterial } from '@prisma/client';

export class BuildingTypesBuilder {
  private builder;
  public building;
  public buildingInput;
  public buildingForMap;
  constructor(fastify: FastifyInstance) {
    this.builder = fastify.pothos;

    this.building = this.builder.prismaObject('Building', {
      fields: (t) => ({
        id: t.exposeInt('id'),
        name: t.exposeString('name'),
        address: t.exposeString('address'),
        completionDate: t.string({
          resolve: (date) => date.completionDate?.toISOString() || null,
          nullable: true,
        }),
        completed: t.exposeBoolean('completed'),
        latitude: t.float({
          nullable: true,
          resolve: (fields) => fields.latitude,
        }),
        longitude: t.float({
          nullable: true,
          resolve: (fields) => fields.longitude,
        }),
        img: t.string({
          nullable: true,
          resolve: (fields) => fields.img,
        }),
        domRfId: t.int({
          nullable: true,
          resolve: (fields) => fields.domRfId,
        }),
        domClickId: t.int({
          nullable: true,
          resolve: (fields) => fields.domClickId,
        }),
        propertyClass: t.field({
          type: PropertyClass,
          nullable: true,
          resolve: ({ propertyClass }) => propertyClass,
        }),
        decorType: t.field({
          type: DecorType,
          nullable: true,
          resolve: ({ decorType }) => decorType,
        }),
        wallMaterial: t.field({
          type: WallMaterial,
          nullable: true,
          resolve: ({ wallMaterial }) => wallMaterial,
        }),
        cityId: t.exposeInt('cityId'),
        districtId: t.exposeInt('districtId'),
        groupId: t.exposeInt('groupId'),
        developerId: t.exposeInt('developerId'),
        complexId: t.exposeInt('complexId'),
        city: t.relation('city'),
        district: t.relation('district'),
        group: t.relation('group'),
        developer: t.relation('developer'),
        complex: t.relation('complex'),
        sales: t.relation('sales'),
        properties: t.relation('properties'),
      }),
    });

    this.buildingInput = this.builder.inputType('BuildingInput', {
      fields: (t) => ({
        id: t.int({ required: false }),
        name: t.string({ required: true }),
        address: t.string({ required: true }),
        completionDate: t.string({ required: true }),
        completed: t.boolean({ required: true, defaultValue: false }),
        latitude: t.float(),
        longitude: t.float(),
        propertyClass: t.field({
          type: PropertyClass,
        }),
        decorType: t.field({
          type: DecorType,
        }),
        wallMaterial: t.field({
          type: WallMaterial,
        }),
        img: t.string(),
        domRfId: t.int(),
        domClickId: t.int(),
        cityId: t.int({ required: true }),
        districtId: t.int({ required: true }),
        groupId: t.int({ required: true }),
        developerId: t.int({ required: true }),
        complexId: t.int({ required: true }),
      }),
    });

    this.buildingForMap = this.builder.objectType(BuildingsForMapDto, {
      name: 'BuildingForMap',
      fields: (t) => ({
        id: t.exposeInt('id'),
        name: t.exposeString('name'),
        latitude: t.exposeFloat('latitude'),
        longitude: t.exposeFloat('longitude'),
        propertyClass: t.field({
          type: PropertyClass,
          nullable: true,
          resolve: ({ propertyClass }) => propertyClass,
        }),
        complexName: t.exposeString('complexName'),
      }),
    });
  }
}
