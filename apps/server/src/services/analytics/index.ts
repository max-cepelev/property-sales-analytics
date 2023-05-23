import { fastifyPlugin } from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { graphqlPlugin } from './plugins/graphql';
import { pothosPlugin } from './plugins/pothos';

import { regionsModule } from './modules/regions';
import { citiesModule } from './modules/cities';
import { districtsModule } from './modules/districts';
import { groupsModule } from './modules/groups';
import { developersModule } from './modules/developers';
import { complexesModule } from './modules/complexes';
import { buildingsModule } from './modules/buildings';
import { salesModule } from './modules/sales';
import { propertiesModule } from './modules/properties';
import { usersModule } from './modules/users';

export const analyticsService = fastifyPlugin(
  async function (
    app: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (err?: Error | undefined) => void,
  ) {
    await app.register(pothosPlugin);

    //modules
    await app.register(usersModule);
    await app.register(regionsModule);
    await app.register(citiesModule);
    await app.register(districtsModule);
    await app.register(groupsModule);
    await app.register(developersModule);
    await app.register(complexesModule);
    await app.register(buildingsModule);
    await app.register(salesModule);
    await app.register(propertiesModule);

    //graphQL
    await app.register(graphqlPlugin);
    done();
  },
  { name: 'analytics' },
);
