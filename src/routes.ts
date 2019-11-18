import * as Router from 'koa-router';

import { PartnerController } from './modules/partner/partner.controller';
import { LeadController } from './modules/lead/lead.controller';
import { LandingController } from './modules/landing/landing.controller';
import { LeadMessengersController } from './modules/leadMessengers/leadMessengers.controller';
// import { verifyToken } from './lib/jwt';
import { upload } from './lib/upload';

const routes = new Router({ prefix: '/api' });
routes.post('/login', PartnerController.authorize);
routes.put('/partner', PartnerController.create);
routes.post('/partner', PartnerController.update);

routes.put('/lead', LeadController.create);

routes.get('/lead/messenger/all', LeadMessengersController.readAll);
routes.post('/lead/messenger', LeadMessengersController.update);

routes.get('/landing-1/:referId', LandingController.getLanding1);
routes.get('/landing-2/:referId', LandingController.getLanding2);
routes.get('/landing-3/:referId', LandingController.getLanding3);
routes.get('/landing-4/:referId', LandingController.getLanding4);

routes.post('/upload', upload);

export default routes;