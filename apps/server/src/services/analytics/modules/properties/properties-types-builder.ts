import { FastifyInstance } from 'fastify';
import {
  PropAggregate,
  PropAggregateResponse,
  PropCounts,
} from './dto/property-aggregate';
import { PropertyType } from '@prisma/client';
import {
  PropertyRoomsAggregate,
  PropertyRoomsAggregateResponse,
} from './dto/property-rooms-aggregate';

export class PropertiesTypesBuilder {
  builder;
  propertyType;
  propCountsType;
  propAggregateType;
  propRoomsAggregateType;
  propRoomsAggregateResponseType;
  propAggregateResponseType;
  propertyInput;
  constructor(private readonly fastify: FastifyInstance) {
    this.builder = fastify.pothos;

    this.propertyType = this.builder.prismaObject('Property', {
      fields: (t) => ({
        id: t.exposeInt('id'),
        floor: t.exposeFloat('floor'),
        number: t.field({
          type: 'String',
          nullable: true,
          resolve: ({ number }) => number,
        }),
        entrance: t.field({
          type: 'Int',
          nullable: true,
          resolve: ({ entrance }) => entrance,
        }),
        totalArea: t.exposeFloat('totalArea'),
        livingArea: t.field({
          type: 'Float',
          nullable: true,
          resolve: ({ livingArea }) => livingArea,
        }),
        propertyType: t.field({
          type: PropertyType,
          nullable: true,
          resolve: ({ propertyType }) => propertyType,
        }),
        rooms: t.field({
          type: 'Int',
          nullable: true,
          resolve: ({ rooms }) => rooms,
        }),
        wallHeight: t.field({
          type: 'Float',
          nullable: true,
          resolve: ({ wallHeight }) => wallHeight,
        }),
        buildingId: t.exposeInt('buildingId'),
        building: t.relation('building'),
      }),
    });

    this.propCountsType = this.builder.objectType(PropCounts, {
      name: 'PropCounts',
      fields: (t) => ({
        living: t.exposeInt('living'),
        commercial: t.exposeInt('commercial'),
        parking: t.exposeInt('parking'),
      }),
    });

    this.propAggregateType = this.builder.objectType(PropAggregate, {
      name: 'PropAggregate',
      fields: (t) => ({
        count: t.exposeInt('count'),
        totalArea: t.exposeFloat('totalArea'),
        avgArea: t.exposeFloat('avgArea'),
        minArea: t.exposeFloat('minArea'),
        maxArea: t.exposeFloat('maxArea'),
        floors: t.exposeInt('floors'),
        entrances: t.exposeInt('entrances'),
      }),
    });

    this.propAggregateResponseType = this.builder.objectType(
      PropAggregateResponse,
      {
        name: 'PropAggregateResponse',
        fields: (t) => ({
          living: t.field({
            type: this.propAggregateType,
            resolve: ({ living }) => living,
          }),
          commercial: t.field({
            type: this.propAggregateType,
            resolve: ({ commercial }) => commercial,
          }),
          parking: t.field({
            type: this.propAggregateType,
            resolve: ({ parking }) => parking,
          }),
        }),
      },
    );

    this.propertyInput = this.builder.inputType('PropertyInput', {
      fields: (t) => ({
        id: t.field({ required: false, type: 'Int' }),
        floor: t.float({ required: true }),
        number: t.string({ required: false }),
        entrance: t.int({ required: false }),
        totalArea: t.float({ required: true }),
        livingArea: t.float({ required: false }),
        rooms: t.int({ required: false }),
        wallHeight: t.float({ required: false }),
        propertyType: t.field({
          type: PropertyType,
          required: true,
        }),
        buildingId: t.int({ required: true }),
      }),
    });

    this.propRoomsAggregateType = this.builder.objectType(
      PropertyRoomsAggregate,
      {
        name: 'PropertyRoomsAggregate',
        fields: (t) => ({
          count: t.exposeInt('count'),
          avgArea: t.exposeFloat('avgArea'),
          minArea: t.exposeFloat('minArea'),
          maxArea: t.exposeFloat('maxArea'),
        }),
      },
    );

    this.propRoomsAggregateResponseType = this.builder.objectType(
      PropertyRoomsAggregateResponse,
      {
        name: 'PropertyRoomsAggregateResponse',
        fields: (t) => ({
          one: t.field({
            type: this.propRoomsAggregateType,
            resolve: ({ one }) => one,
          }),
          two: t.field({
            type: this.propRoomsAggregateType,
            resolve: ({ two }) => two,
          }),
          three: t.field({
            type: this.propRoomsAggregateType,
            resolve: ({ three }) => three,
          }),
          four: t.field({
            type: this.propRoomsAggregateType,
            resolve: ({ four }) => four,
          }),
        }),
      },
    );
  }
}
