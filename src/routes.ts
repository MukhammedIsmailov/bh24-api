import * as Router from 'koa-router';

import { PartnerController } from './partner/partner.controller';
import { LeadController } from './lead/lead.controller';

const routes = new Router({ prefix: '/api' });

routes.put('/partner', PartnerController.create);

routes.get('/lead/:referId', LeadController.read);

export default routes;