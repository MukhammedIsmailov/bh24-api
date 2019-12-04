import * as Router from 'koa-router';

import { PartnerController } from './modules/partner/partner.controller';
import { LeadController } from './modules/lead/lead.controller';
import { LeadMessengersController } from './modules/leadMessengers/leadMessengers.controller';
import { EventController } from './modules/event/event.controller';
import { StatisticsController } from './modules/statistics/statistics.controller';

// import { verifyToken } from './lib/jwt';
import { upload } from './lib/upload';

const routes = new Router({ prefix: '/api' });
routes.post('/login', PartnerController.authorize);
routes.get('/partner', PartnerController.read);
routes.put('/partner', PartnerController.create);
routes.post('/partner', PartnerController.update);

routes.put('/lead', LeadController.create);

routes.get('/lead/messenger/all', LeadMessengersController.readAll);
routes.post('/lead/messenger', LeadMessengersController.update);

routes.put('/event/landing-visit', EventController.landingVisitLogCreate);

routes.get('/statistics/plot', StatisticsController.statisticsForPlotRead);

routes.post('/upload', upload);

export default routes;