import {
  Prisma,
  PrismaClient,
  PropertyClass,
  PropertyType,
  Sale,
} from '@prisma/client';

import {
  SalesData,
  SalesDataByBuilding,
  SalesDataByComplex,
  SalesDataResponse,
  SalesAnalyticsResponse,
  SalesSum,
  SalesSumByPropertyType,
  SaleInput,
  BuildingWithoutSales,
} from './dto';

export class SalesService {
  constructor(private prisma: PrismaClient) {}

  async saveAll(data: SaleInput[]) {
    const response: Sale[] = [];
    for await (const sale of data) {
      const id = sale.id;
      const res = id
        ? await this.prisma.sale.update({
            where: { id },
            data: { ...sale, id },
          })
        : await this.prisma.sale.create({
            data: { ...sale, id: undefined },
          });
      if (res) {
        response.push(res);
      }
    }
    return response;
  }

  async create(data: Prisma.SaleUncheckedCreateInput) {
    return this.prisma.sale.create({ data });
  }

  async findAll({
    query,
    buildingId,
    propertyType,
  }: {
    query: {
      include?: Prisma.SaleInclude | undefined;
      select?: Prisma.SaleSelect | undefined;
    };
    buildingId?: number;
    propertyType?: PropertyType;
  }) {
    const keys: Prisma.SaleWhereInput[] = [];
    buildingId && keys.push({ buildingId });
    propertyType && keys.push({ propertyType });
    return this.prisma.sale.findMany({
      where: { AND: keys },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
      ...query,
    });
  }

  async findOne(id: number) {
    return this.prisma.sale.findUnique({
      where: { id },
      include: { building: true },
    });
  }

  async update(id: number, data: Prisma.SaleUncheckedUpdateInput) {
    return this.prisma.sale.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.sale.delete({ where: { id } });
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
    return await this.prisma.group
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
  }

  async getBuildingsWhereNullSales(date: string) {
    const dt = new Date(date);
    const month = dt.getMonth();
    const year = dt.getFullYear();
    const response: BuildingWithoutSales[] = [];
    const buildings = await this.prisma.building.findMany({
      where: {
        completed: false,
      },
      orderBy: { completionDate: 'asc' },
      select: {
        id: true,
        name: true,
        completionDate: true,
        domRfId: true,
        domClickId: true,
      },
    });
    for await (const building of buildings) {
      const tags: PropertyType[] = [];
      const living = await this.prisma.property.count({
        where: { buildingId: building.id, propertyType: 'LIVING' },
      });
      if (living) {
        const livingSales = await this.getSalesSum({
          propertyType: 'LIVING',
          buildingIds: [building.id],
          year,
          month,
        });
        livingSales.amount === null && tags.push('LIVING');
      }

      const commercial = await this.prisma.property.count({
        where: { buildingId: building.id, propertyType: 'COMMERCIAL' },
      });
      if (commercial) {
        const commercialSales = await this.getSalesSum({
          propertyType: 'COMMERCIAL',
          buildingIds: [building.id],
          year,
          month,
        });
        commercialSales.amount === null && tags.push('COMMERCIAL');
      }

      const parking = await this.prisma.property.count({
        where: { buildingId: building.id, propertyType: 'PARKING' },
      });
      if (parking) {
        const parkingSales = await this.getSalesSum({
          propertyType: 'PARKING',
          buildingIds: [building.id],
          year,
          month,
        });
        parkingSales.amount === null && tags.push('PARKING');
      }

      if (tags.length) {
        response.push({ ...building, tags });
      }
    }
    return response;
  }
}
