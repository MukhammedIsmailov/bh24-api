import * as Router from 'koa-router';

import { PartnerController } from './partner/partner.controller';

const routes = new Router({ prefix: '/api' });

routes.put('/partner', PartnerController.create);

export default routes;