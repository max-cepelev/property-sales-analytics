import { FastifyInstance } from 'fastify';
import { PropertyType } from '@prisma/client';
import {
  SalesData,
  SalesDataByBuilding,
  SalesDataByComplex,
  SalesDataResponse,
  SalesAnalyticsResponse,
  SalesSum,
  SalesSumByPropertyType,
  BuildingWithoutSales,
  SalesDataByGroup,
} from './dto';

export class SalesTypesBuilder {
  readonly builder;
  readonly sale;
  readonly saleInput;
  readonly salesData;
  readonly salesDataByBuilding;
  readonly salesDataByComplex;
  readonly salesDataByGroup;
  readonly salesDataResponse;
  readonly salesSum;
  readonly salesSumByPropertyType;
  readonly salesAnalyticsResponse;
  readonly buildingWithoutSales;
  constructor(private readonly fastify: FastifyInstance) {
    this.builder = fastify.pothos;

    this.sale = this.builder.prismaObject('Sale', {
      fields: (t) => ({
        id: t.exposeInt('id'),
        month: t.exposeInt('month'),
        year: t.exposeInt('year'),
        amount: t.exposeInt('amount'),
        area: t.exposeFloat('area'),
        sum: t.exposeFloat('sum'),
        propertyType: t.field({
          type: PropertyType,
          nullable: true,
          resolve: ({ propertyType }) => propertyType,
        }),
        buildingId: t.exposeInt('buildingId'),
        building: t.relation('building'),
      }),
    });

    this.saleInput = this.builder.inputType('SaleInput', {
      fields: (t) => ({
        id: t.int({ required: false }),
        month: t.int({ required: true }),
        year: t.int({ required: true }),
        amount: t.int({ required: true }),
        area: t.float({ required: true }),
        sum: t.float({ required: true }),
        propertyType: t.field({
          type: PropertyType,
          required: true,
        }),
        buildingId: t.int({ required: true }),
      }),
    });

    this.salesData = this.builder.objectType(SalesData, {
      name: 'SalesData',
      fields: (t) => ({
        number: t.exposeInt('number'),
        area: t.exposeFloat('area'),
        price: t.exposeFloat('price'),
      }),
    });

    this.salesDataByBuilding = this.builder.objectType(SalesDataByBuilding, {
      name: 'SalesDataByBuilding',
      fields: (t) => ({
        id: t.exposeInt('id'),
        name: t.exposeString('name'),
        complexName: t.exposeString('complexName'),
        groupName: t.exposeString('groupName'),
        completionDate: t.exposeString('completionDate'),
        sales: t.field({
          type: this.salesData,
          resolve: ({ sales }) => sales,
        }),
      }),
    });

    this.salesDataByComplex = this.builder.objectType(SalesDataByComplex, {
      name: 'SalesDataByComplex',
      fields: (t) => ({
        id: t.exposeInt('id'),
        name: t.exposeString('name'),
        groupName: t.exposeString('groupName'),
        buildings: t.field({
          type: [this.salesDataByBuilding],
          resolve: ({ buildings }) => buildings,
        }),
        sales: t.field({ type: this.salesData, resolve: ({ sales }) => sales }),
      }),
    });

    this.salesDataByGroup = this.builder.objectType(SalesDataByGroup, {
      name: 'SalesDataByGroup',
      fields: (t) => ({
        id: t.exposeInt('id'),
        name: t.exposeString('name'),
        complexes: t.field({
          type: [this.salesDataByComplex],
          resolve: ({ complexes }) => complexes,
        }),
        sales: t.field({ type: this.salesData, resolve: ({ sales }) => sales }),
      }),
    });

    this.salesDataResponse = this.builder.objectType(SalesDataResponse, {
      name: 'SalesDataResponse',
      fields: (t) => ({
        year: t.exposeInt('year'),
        month: t.exposeInt('month'),
        groups: t.field({
          type: [this.salesDataByGroup],
          resolve: ({ groups }) => groups,
        }),
      }),
    });

    this.salesSum = this.builder.objectType(SalesSum, {
      name: 'SalesSum',
      fields: (t) => ({
        area: t.exposeFloat('area', { nullable: true }),
        amount: t.exposeInt('amount', { nullable: true }),
        sum: t.exposeFloat('sum', { nullable: true }),
      }),
    });

    this.salesSumByPropertyType = this.builder.objectType(
      SalesSumByPropertyType,
      {
        name: 'SalesSumByPropertyType',
        fields: (t) => ({
          living: t.field({
            type: this.salesSum,
            resolve: ({ living }) => living,
          }),
          commercial: t.field({
            type: this.salesSum,
            resolve: ({ commercial }) => commercial,
          }),
          parking: t.field({
            type: this.salesSum,
            resolve: ({ parking }) => parking,
          }),
        }),
      },
    );

    this.salesAnalyticsResponse = this.builder.objectType(
      SalesAnalyticsResponse,
      {
        name: 'SalesAnalyticsResponse',
        fields: (t) => ({
          date: t.exposeString('date'),
          area: t.field({
            type: 'Float',
            nullable: true,
            resolve: ({ area }) => area,
          }),
          amount: t.field({
            type: 'Int',
            nullable: true,
            resolve: ({ amount }) => amount,
          }),
          sum: t.field({
            type: 'Float',
            nullable: true,
            resolve: ({ sum }) => sum,
          }),
        }),
      },
    );

    this.buildingWithoutSales = this.builder.objectType(BuildingWithoutSales, {
      name: 'BuildingWithoutSales',
      fields: (t) => ({
        id: t.exposeInt('id'),
        name: t.exposeString('name'),
        completionDate: t.field({
          type: 'String',
          resolve: ({ completionDate }) => completionDate.toISOString(),
        }),
        domRfId: t.exposeInt('domRfId', { nullable: true }),
        domClickId: t.exposeInt('domClickId', { nullable: true }),
        tags: t.field({
          type: [PropertyType],
          resolve: ({ tags }) => tags,
        }),
      }),
    });
  }
}
