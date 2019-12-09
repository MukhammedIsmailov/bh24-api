import * as Router from 'koa-router';

import { UserController } from './modules/user/user.controller';
import { LeadMessengersController } from './modules/leadMessengers/leadMessengers.controller';
import { EventController } from './modules/event/event.controller';
import { StatisticsController } from './modules/statistics/statistics.controller';
import { LessonEventController } from './modules/lessonEvent/lessonEvent.controller';

// import { verifyToken } from './lib/jwt';
import { upload } from './lib/upload';

const routes = new Router({ prefix: '/api' });
routes.post('/login', UserController.authorize);

routes.get('/partner', UserController.partnerRead);
routes.put('/partner', UserController.partnerCreate);
routes.post('/partner', UserController.partnerUpdate);

routes.put('/lead', UserController.leadCreate);

routes.get('/lead/messenger/all', LeadMessengersController.readAll);
routes.post('/lead/messenger', LeadMessengersController.update);

routes.put('/event/landing-visit', EventController.landingVisitLogCreate);
routes.put('/event/course-finished', EventController.courseFinishedLogCreate);

routes.get('/statistics/plot', StatisticsController.statisticsForPlotRead);

routes.put('/lesson-event', LessonEventController.lessonEventLogCreate);
routes.get('/lesson-events', LessonEventController.lessonEventsRead);

routes.post('/ward', UserController.wardUpdate);
routes.post('/wards', UserController.wardRead);

routes.post('/upload', upload);

export default routes;