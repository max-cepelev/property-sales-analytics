import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import plugin from 'fastify-plugin';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { IFamalyMacroData, IMacroData, MinipolisData } from './macro.entities';
import {
  ERROR_RESPONSE_SCHEMA,
  MacroResponse,
  MACRO_RESPONSE_SCHEMA,
} from './macro.schema';
import { transformMacroData, transformMinipolis } from './utils/data-mapping';

type Request = FastifyRequest<{
  Reply: MacroResponse | { message: string };
}>;

export const macroModule = plugin(
  function (app: FastifyInstance, _: FastifyPluginOptions, next: () => void) {
    const baseUrl = 'https://api.macroserver.ru/estate/export/web/';

    const options = {
      schema: {
        tags: ['Macro'],
        response: {
          200: MACRO_RESPONSE_SCHEMA,
          500: ERROR_RESPONSE_SCHEMA,
        },
      },
    };

    /**
     * @Танго
     */
    app
      .withTypeProvider<ZodTypeProvider>()
      .get('/api/macro/tango', options, async (request: Request, reply) => {
        const { redis } = app;
        try {
          const data = await redis.get('tango');
          if (data) {
            reply.status(200).send(JSON.parse(data));
          } else {
            const { got } = await import('got');
            const response = await got
              .get(
                `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUidCjsLh2SmuY8_cpp8MTYzNTU4OTI3MXxmMzU0Mg/334-web.json`,
                {
                  timeout: {
                    request: 10000,
                  },
                  searchParams: {
                    feed_id: 1174,
                  },
                },
              )
              .json<IMacroData[]>();
            if (response) {
              const data = transformMacroData(response);
              await redis.set('tango', JSON.stringify(data), 'EX', 3600);
              reply.status(200).send(data);
            }
          }
        } catch (error) {
          reply.status(500).send({ message: 'Ошибка получения данных' });
        }
      });

    /**
     * @Скворцы
     */
    app
      .withTypeProvider<ZodTypeProvider>()
      .get('/api/macro/skvortsy', options, async (request: Request, reply) => {
        const { redis } = app;
        try {
          const data = await redis.get('skvortsy');
          if (data) {
            reply.status(200).send(JSON.parse(data));
          } else {
            const { got } = await import('got');
            const response = await got
              .get(
                `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUqZCjsKh2SmuY8_cpp8MTYzNjgzMzIwN3w2OGIzMw/334-web.json`,
                {
                  timeout: {
                    request: 10000,
                  },
                  searchParams: {
                    feed_id: 1207,
                  },
                },
              )
              .json<IMacroData[]>();
            if (response) {
              const data = transformMacroData(response);
              await redis.set('skvortsy', JSON.stringify(data), 'EX', 3600);
              reply.status(200).send(data);
            }
          }
        } catch (error) {
          reply.status(500).send({ message: 'Ошибка получения данных' });
        }
      });

    /**
     * @Малая_6
     */
    app
      .withTypeProvider<ZodTypeProvider>()
      .get('/api/macro/malaya', options, async (request: Request, reply) => {
        const { redis } = app;
        try {
          const data = await redis.get('malaya');
          if (data) {
            reply.status(200).send(JSON.parse(data));
          } else {
            const { got } = await import('got');
            const response = await got
              .get(
                `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUqYCjsKh2SmuYw_cpp8MTY2ODUxOTE2N3wyYjdjZQ/334-web.json`,
                {
                  timeout: {
                    request: 10000,
                  },
                  searchParams: {
                    feed_id: 2386,
                  },
                },
              )
              .json<IMacroData[]>();
            if (response) {
              const data = transformMacroData(response);
              await redis.set('malaya', JSON.stringify(data), 'EX', 3600);
              reply.status(200).send(data);
            }
          }
        } catch (error) {
          reply.status(500).send({ message: 'Ошибка получения данных' });
        }
      });

    /**
     * @Миниполис
     */
    app
      .withTypeProvider<ZodTypeProvider>()
      .get('/api/macro/minipolis', options, async (request: Request, reply) => {
        const { redis } = app;
        try {
          const data = await redis.get('minipolis');
          if (data) {
            reply.status(200).send(JSON.parse(data));
          } else {
            const { got } = await import('got');
            const response = await got
              .get(
                'https://api.macroserver.ru/estate/export/sdb/H7Whb0yfEyUOMbVk9darbXsfKHjUBwCZe-U8rWZXzBDskXF5bu-sECRBYqaXyKtgZgilcpqgaXiiQVPx9U5I6Hsbq_O30Djw1AKCSdAo9ApwlPx-31ATO2BJR2DLp-40qJ68pUF8MTY3NzIyMjIyOXw4ODE5Zg/586-sdb.json',
                {
                  timeout: {
                    request: 25000,
                  },
                  searchParams: {
                    feed_id: 2773,
                  },
                },
              )
              .json<{
                dateGeneration: string;
                records: MinipolisData[];
              }>();
            if (response.records) {
              const data = transformMinipolis(response.records);
              await redis.set('minipolis', JSON.stringify(data), 'EX', 3600);
              reply.status(200).send(data);
            }
          }
        } catch (error) {
          reply.status(500).send({ message: 'Ошибка получения данных' });
        }
      });

    /**
     * @Семья
     */
    app
      .withTypeProvider<ZodTypeProvider>()
      .get('/api/macro/family', options, async (request: Request, reply) => {
        const { redis } = app;
        try {
          const data = await redis.get('family');
          if (data) {
            reply.status(200).send(JSON.parse(data));
          } else {
            const { got } = await import('got');
            const response = await got
              .get(
                'https://api.macroserver.ru/estate/export/sdb/H7Whb0yfEyUOMbVk9darbXsfKHjUBwCZe-U0rGZXzBDskXF5bu-sECRBYqaXyKtgZgilcpqgaXiiQVPx9U5I6Hsbq_O30Djw1AKCSdAo9ApwlPx-31ATO2BER2DNp-40qJ-8pUF8MTY1MTIxMjQ4M3w0NTE4MA/507-sdb.json',
                {
                  timeout: {
                    request: 10000,
                  },
                  searchParams: {
                    feed_id: 1579,
                  },
                },
              )
              .json<IFamalyMacroData>();
            if (response) {
              const data = transformMacroData(response.records);
              await redis.set('family', JSON.stringify(data), 'EX', 3600);
              reply.status(200).send(data);
            }
          }
        } catch (error) {
          app.log.error(error);
          reply.status(500).send({ message: 'Ошибка получения данных' });
        }
      });

    /**
     * @Островского
     */
    app
      .withTypeProvider<ZodTypeProvider>()
      .get(
        '/api/macro/ostrovskogo',
        options,
        async (request: Request, reply) => {
          const { redis } = app;
          try {
            const data = await redis.get('ostrovskogo');
            if (data) {
              reply.status(200).send(JSON.parse(data));
            } else {
              const { got } = await import('got');
              const response = await got
                .get(
                  'https://api.macroserver.ru/estate/export/web/zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUqfCjoKh2SmuY0_cpp8MTY3MzQ5NTEwN3w2YzFkNQ/334-web.json',
                  {
                    timeout: {
                      request: 10000,
                    },
                    searchParams: {
                      feed_id: 2618,
                    },
                  },
                )
                .json<IMacroData[]>();
              if (response) {
                const data = transformMacroData(response);
                await redis.set(
                  'ostrovskogo',
                  JSON.stringify(data),
                  'EX',
                  3600,
                );
                reply.status(200).send(data);
              }
            }
          } catch (error) {
            reply.status(500).send({ message: 'Ошибка получения данных' });
          }
        },
      );

    /**
     * @Все_свои
     */
    app
      .withTypeProvider<ZodTypeProvider>()
      .get('/api/macro/vse-svoi', options, async (request: Request, reply) => {
        const { redis } = app;
        try {
          const data = await redis.get('vse-svoi');
          if (data) {
            reply.status(200).send(JSON.parse(data));
          } else {
            const { got } = await import('got');
            const response = await got
              .get(
                'https://api.macroserver.ru/estate/export/web/zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_6MhzrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUmdCjoOh2SmuYw_cpp8MTY1MzAzMzcxM3wzMzdjNg/507-web.json',
                {
                  timeout: {
                    request: 10000,
                  },
                  searchParams: {
                    feed_id: 1664,
                  },
                },
              )
              .json<IMacroData[]>();
            if (response) {
              const data = transformMacroData(response);
              await redis.set('vse-svoi', JSON.stringify(data), 'EX', 3600);
              reply.status(200).send(data);
            }
          }
        } catch (error) {
          reply.status(500).send({ message: 'Ошибка получения данных' });
        }
      });

    next();
  },
  { name: 'Macro' },
);
