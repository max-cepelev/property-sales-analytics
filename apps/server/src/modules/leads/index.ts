import { randomUUID } from 'node:crypto';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import plugin from 'fastify-plugin';
import { Prisma } from '@prisma/client';
import { convertKeysToLowerCase } from '../../utils/convertKeysToLowerCase';

export const leadsModule = plugin(async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  fastify.post('/api/leads', async (request, reply) => {
    try {
      const hostName = request.headers.referer
        ? new URL(request.headers.referer).host
        : null;
      const data = convertKeysToLowerCase(
        request.body as {
          [key: string]: any;
        },
      );
      const dto: Prisma.LeadUncheckedCreateInput = {
        uniq_id: randomUUID(),
        host: hostName,
        name: data.name || null,
        phone: data.phone || null,
        email: data.email || null,
        form_name: data.form_name || null,
        form_id: data.form_id || null,
        tran_id: data.tran_id || null,
        utm_source: data.utm_source || null,
        utm_medium: data.utm_medium || null,
        utm_campaign: data.utm_campaign || null,
        utm_term: data.utm_term || null,
      };
      await fastify.prisma.lead.create({ data: dto });
      reply.status(200).send({ message: 'ok' });
    } catch (error) {
      reply.status(500).send({ message: 'Возникла ошибка при создании лида' });
    }
  });
  done();
});
