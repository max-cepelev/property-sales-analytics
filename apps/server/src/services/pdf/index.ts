import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';
import { PdfService } from './pdf.service';

export const pdfModule = plugin(async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  const pdfService = new PdfService(fastify);

  fastify.get('/pdf', async (request, reply) => {
    const buildings = await fastify.prisma.building.findMany({
      where: { domRfId: { not: null }, completed: false },
      select: {
        id: true,
        domRfId: true,
        name: true,
        completed: true,
        sales: { orderBy: [{ year: 'desc' }, { month: 'desc' }], take: 1 },
      },
    });
    //   const living = await fastify.prisma.sale.findFirst({
    //     where: { buildingId: building.id, propertyType: 'LIVING' },
    //     orderBy: [{ year: 'desc' }, { month: 'desc' }],
    //   });
    //   const commercial = await fastify.prisma.sale.findFirst({
    //     where: { buildingId: building.id, propertyType: 'COMMERCIAL' },
    //     orderBy: [{ year: 'desc' }, { month: 'desc' }],
    //   });
    //   const parking = await fastify.prisma.sale.findFirst({
    //     where: { buildingId: building.id, propertyType: 'PARKING' },
    //     orderBy: [{ year: 'desc' }, { month: 'desc' }],
    //   });
    //   building['sales'] = {
    //     living,
    //     commercial,
    //     parking,
    //   };
    // }

    const data = await pdfService.getPdf(buildings.slice(47, 48));
    reply.send(data);
  });
  done();
});
