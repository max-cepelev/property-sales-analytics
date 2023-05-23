import {
  Prisma,
  PrismaClient,
  Property,
  PropertyClass,
  PropertyType,
} from '@prisma/client';

import { PropCounts, PropAggregate } from './dto/property-aggregate';
import { PropertyRoomsAggregate } from './dto/property-rooms-aggregate';
import { PropertyInput } from './dto/property.input';

export class PropertiesService {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.PropertyUncheckedCreateInput) {
    return this.prisma.property.create({ data });
  }

  async saveProperties(data: PropertyInput[]) {
    const response: Property[] = [];
    for await (const property of data) {
      const id = property.id;
      const res = id
        ? await this.prisma.property.update({
            data: { ...property, id },
            where: { id },
          })
        : await this.prisma.property.create({
            data: { ...property, id: undefined },
          });
      if (res) {
        response.push(res);
      }
    }
    return response;
  }

  async findAll(buildingId?: number, propertyType?: PropertyType) {
    return this.prisma.property.findMany({
      where: {
        buildingId: buildingId ?? undefined,
        propertyType: propertyType ?? undefined,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.property.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.PropertyUncheckedUpdateInput) {
    return this.prisma.property.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.property.delete({ where: { id } });
  }

  async getPropCounts(buildingId: number): Promise<PropCounts> {
    const living = await this.prisma.property.count({
      where: { buildingId, propertyType: 'LIVING' },
    });

    const commercial = await this.prisma.property.count({
      where: { buildingId, propertyType: 'COMMERCIAL' },
    });

    const parking = await this.prisma.property.count({
      where: { buildingId, propertyType: 'PARKING' },
    });

    return { living, commercial, parking };
  }

  async getPropAggregateByRoomsAmount(buildingId: number): Promise<any> {
    const keys = ['one', 'two', 'three', 'four'];
    const rooms = new Map<string, PropertyRoomsAggregate>();
    for await (const key of keys) {
      const data: PropertyRoomsAggregate = await this.prisma.property
        .aggregate({
          where: {
            buildingId,
            propertyType: 'LIVING',
            rooms: keys.indexOf(key) + 1,
          },
          _count: true,
          _avg: {
            totalArea: true,
          },
          _min: {
            totalArea: true,
          },
          _max: {
            totalArea: true,
          },
        })
        .then((res) => ({
          count: Number(res._count),
          minArea: res._min.totalArea || 0,
          maxArea: res._max.totalArea || 0,
          avgArea: res._avg.totalArea || 0,
        }));
      rooms.set(key, data);
    }
    return Object.fromEntries(rooms);
  }

  async getPropAggregate({
    buildingIds,
    propertyClass,
    districtId,
  }: {
    buildingIds: number[];
    propertyClass?: PropertyClass;
    districtId?: number;
  }): Promise<any> {
    const response = new Map<string, PropAggregate>();
    for (const value of Object.values(PropertyType)) {
      const data: PropAggregate = await this.prisma.property
        .aggregate({
          where: {
            propertyType: value,
            buildingId: buildingIds.length ? { in: buildingIds } : undefined,
            building: {
              districtId,
              propertyClass,
            },
          },
          _count: true,
          _sum: {
            totalArea: true,
          },
          _avg: {
            totalArea: true,
          },
          _min: {
            totalArea: true,
          },
          _max: {
            totalArea: true,
            floor: true,
            entrance: true,
          },
        })
        .then((res) => ({
          count: res._count,
          totalArea: res._sum.totalArea || 0,
          avgArea: res._avg.totalArea || 0,
          minArea: res._min.totalArea || 0,
          maxArea: res._max.totalArea || 0,
          floors: res._max.floor || 0,
          entrances: res._max.entrance || 0,
        }));
      response.set(value.toLowerCase(), data);
    }

    return Object.fromEntries(response);
  }
}
