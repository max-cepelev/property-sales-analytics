import {
  Building,
  Prisma,
  PrismaClient,
  PropertyClass,
  PropertyType,
  Sale,
} from '@prisma/client';

import { SalesAnalyticsResponse } from './dto/sales-analytics.response';
import { SalesData, SalesDataResponse } from './dto/sales-data-by-groups';
import { SalesDataByComplex } from './dto/sales-data-by-groups';
import { SalesDataByBuilding } from './dto/sales-data-by-groups';
import { SalesSum } from './dto/sales-sum';
import { SalesSumByPropertyType } from './dto/sales-sum-by-property-type';

export class SalesService {
  constructor(private prisma: PrismaClient) {}

  async saveAll(data: Prisma.SaleUncheckedCreateInput[]) {
    const response: Sale[] = [];
    for await (const sale of data) {
      const res = sale.id
        ? await this.prisma.sale.update({
            where: { id: sale.id },
            data: sale,
          })
        : await this.prisma.sale.create({
            data: sale,
          });
      res && response.push(res);
    }
    return response;
  }

  async create(data: Prisma.SaleUncheckedCreateInput) {
    const sale = await this.prisma.sale.create({ data });
    return sale;
  }

  async findAll(buildingId?: number, propertyType?: PropertyType) {
    const keys: Prisma.SaleWhereInput[] = [];
    buildingId && keys.push({ buildingId });
    propertyType && keys.push({ propertyType });
    const sales = await this.prisma.sale.findMany({
      where: { AND: keys },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });
    return sales;
  }

  async findOne(id: number) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: { building: true },
    });
    return sale;
  }

  async update(id: number, data: Prisma.SaleUncheckedUpdateInput) {
    const sale = await this.prisma.sale.update({
      where: { id },
      data,
    });
    return sale;
  }

  async remove(id: number) {
    const response = await this.prisma.sale.delete({ where: { id } });
    return response;
  }

  async getSalesAnalytics({
    propertyType,
    buildingIds,
    propertyClass,
    districtId,
  }: {
    propertyType: PropertyType;
    buildingIds?: number[];
    propertyClass?: PropertyClass;
    districtId?: number;
  }): Promise<SalesAnalyticsResponse[]> {
    const lastRecord = await this.prisma.sale.findFirst({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
    const now = lastRecord
      ? new Date(lastRecord.year, lastRecord.month)
      : new Date();
    const startDate = new Date(now.getFullYear() - 1, now.getMonth());
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1);

    const data = [];
    while (startDate < endDate) {
      const sales = await this.getSalesSum({
        propertyType,
        year: startDate.getFullYear(),
        month: startDate.getMonth(),
        buildingIds:
          buildingIds && buildingIds.length > 0 ? buildingIds : undefined,
        propertyClass,
        districtId,
      });
      data.push({
        date: startDate.toISOString(),
        ...sales,
      });
      startDate.setMonth(startDate.getMonth() + 1);
    }
    return data;
  }

  async getSalesSum({
    propertyType,
    propertyClass,
    buildingIds,
    year,
    month,
    districtId,
  }: {
    propertyType: PropertyType;
    propertyClass?: PropertyClass;
    buildingIds?: number[];
    year?: number;
    month?: number;
    districtId?: number;
  }): Promise<SalesSum> {
    const data = await this.prisma.sale.aggregate({
      where: {
        propertyType,
        year,
        month,
        buildingId: buildingIds ? { in: buildingIds } : undefined,
        building: { propertyClass, districtId },
      },
      _sum: {
        area: true,
        amount: true,
        sum: true,
      },
    });

    return data._sum;
  }

  async getSalesSumByBuildingId({
    buildingIds,
    propertyClass,
    districtId,
  }: {
    buildingIds: number[];
    propertyClass?: PropertyClass;
    districtId?: number;
  }): Promise<SalesSumByPropertyType> {
    const living = await this.getSalesSum({
      buildingIds: buildingIds.length ? buildingIds : undefined,
      propertyType: 'LIVING',
      propertyClass,
      districtId,
    });
    const commercial = await this.getSalesSum({
      buildingIds: buildingIds.length ? buildingIds : undefined,
      propertyType: 'COMMERCIAL',
      propertyClass,
      districtId,
    });
    const parking = await this.getSalesSum({
      buildingIds: buildingIds.length ? buildingIds : undefined,
      propertyType: 'PARKING',
      propertyClass,
      districtId,
    });
    return { living, commercial, parking };
  }

  getSalesData(data: SalesSum): SalesData | null {
    const { amount, area, sum } = data;
    if (amount && amount > 0 && area && sum) {
      return {
        number: Math.round(amount),
        area: Math.round(area),
        price: Math.round(sum / area / 1000),
      };
    } else {
      return null;
    }
  }

  async getSalesDataByGroups({
    propertyType,
    year,
    month,
    propertyClass,
    districtId,
    favorites,
  }: {
    propertyType: PropertyType;
    year: number;
    month: number;
    propertyClass?: PropertyClass;
    districtId?: number;
    favorites?: number[];
  }): Promise<SalesDataResponse> {
    const data = await this.prisma.group
      .findMany({
        select: {
          id: true,
          name: true,
          complexes: {
            select: {
              id: true,
              name: true,
              buildings: {
                select: { id: true, name: true, completionDate: true },
                where: favorites?.length
                  ? { id: { in: favorites } }
                  : undefined,
              },
            },
          },
        },
      })
      .then(async (data) => {
        const response: SalesDataResponse = {
          year,
          month,
          groups: [],
        };
        for await (const group of data) {
          const buildingIds = [];
          const complexes: SalesDataByComplex[] = [];
          for await (const complex of group.complexes) {
            const buildings: SalesDataByBuilding[] = [];
            for await (const building of complex.buildings) {
              const sales = await this.getSalesSum({
                propertyType,
                year,
                month,
                buildingIds: [building.id],
                propertyClass,
                districtId,
              }).then((res) => this.getSalesData(res));
              if (sales) {
                buildings.push({
                  ...building,
                  sales,
                  groupName: group.name,
                  complexName: complex.name,
                  completionDate: building.completionDate.toISOString(),
                });
                buildingIds.push(building.id);
              }
            }
            const sales = await this.getSalesSum({
              propertyType,
              year,
              month,
              buildingIds: buildings.map((item) => item.id),
              propertyClass,
              districtId,
            }).then((res) => this.getSalesData(res));
            if (sales) {
              complexes.push({
                ...complex,
                buildings,
                sales,
                groupName: group.name,
              });
            }
          }
          const sales = await this.getSalesSum({
            propertyType,
            year,
            month,
            buildingIds,
            propertyClass,
            districtId,
          }).then((res) => this.getSalesData(res));
          if (sales) {
            response.groups.push({ ...group, complexes, sales });
          }
        }
        return response;
      });
    return data;
  }

  async getBuildingsWhereNullSales(date: string) {
    const dt = new Date(date);
    const month = dt.getMonth();
    const year = dt.getFullYear();
    const response: (Building & { message: string })[] = [];
    const buildings = await this.prisma.building.findMany({
      where: {
        completed: false,
      },
    });
    for await (const building of buildings) {
      const messages = [];
      const livingSales = await this.getSalesSum({
        propertyType: 'LIVING',
        buildingIds: [building.id],
        year,
        month,
      });
      const commercialSales = await this.getSalesSum({
        propertyType: 'COMMERCIAL',
        buildingIds: [building.id],
        year,
        month,
      });
      const parkingSales = await this.getSalesSum({
        propertyType: 'PARKING',
        buildingIds: [building.id],
        year,
        month,
      });
      const living = await this.prisma.property.count({
        where: { buildingId: building.id, propertyType: 'LIVING' },
      });

      const commercial = await this.prisma.property.count({
        where: { buildingId: building.id, propertyType: 'COMMERCIAL' },
      });

      const parking = await this.prisma.property.count({
        where: { buildingId: building.id, propertyType: 'PARKING' },
      });
      if (living !== 0 && livingSales.amount === 0) {
        messages.push('жилые');
      }
      if (commercial !== 0 && commercialSales.amount === 0) {
        messages.push('коммерческие');
      }
      if (parking !== 0 && parkingSales.amount === 0) {
        messages.push('парковки');
      }
      if (messages.length) {
        response.push({ ...building, message: messages.toString() });
      }
    }
    return response;
  }
}
