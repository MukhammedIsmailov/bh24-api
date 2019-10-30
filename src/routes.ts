import * as Router from 'koa-router';

import { PartnerController } from './modules/partner/partner.controller';
import { LeadController } from './modules/lead/lead.controller';
import { LandingController } from './modules/landing/landing.controller';

const routes = new Router({ prefix: '/api' });

routes.put('/partner', PartnerController.create);

routes.get('/lead/:referId/:type', LeadController.create);

routes.get('/landing-1/:referId', LandingController.getLanding1);
routes.get('/landing-2/:referId', LandingController.getLanding2);
routes.get('/landing-3/:referId', LandingController.getLanding3);
routes.get('/landing-4/:referId', LandingController.getLanding4);

export default routes;