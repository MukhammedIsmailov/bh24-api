import * as Router from 'koa-router';

import { UserController } from './modules/user/user.controller';
import { LeadMessengersController } from './modules/leadMessengers/leadMessengers.controller';
import { EventController } from './modules/event/event.controller';
import { StatisticsController } from './modules/statistics/statistics.controller';
import { LessonEventController } from './modules/lessonEvent/lessonEvent.controller';

import { verifyToken } from './lib/jwt';
import { upload } from './lib/upload';

const routes = new Router({ prefix: '/api' });

// for system
routes.get('/me',verifyToken, UserController.me);
routes.post('/login', UserController.authorize);
routes.put('/partner', UserController.partnerCreate);
routes.get('/partner/byId', UserController.partnerReadById);
routes.get('/partner/byReferId', UserController.partnerReadByReferId);
routes.post('/partner', UserController.partnerUpdate);
routes.post('/upload', upload);
routes.post('/ward', verifyToken, UserController.wardUpdate);
routes.post('/wards', verifyToken, UserController.wardRead);
routes.get('/statistics', verifyToken, StatisticsController.statisticsRead);
routes.get('/lesson-events', verifyToken, LessonEventController.lessonEventsRead);
routes.get('/leads', verifyToken, UserController.leadsRead);
routes.get('/latest-registrations', verifyToken, StatisticsController.latestRegistrationsRead);

// for landing
routes.put('/event/landing-visit', EventController.landingVisitLogCreate);

// for chat-bots
routes.put('/lead', UserController.leadCreate);
routes.get('/lead/messenger/all', LeadMessengersController.readAll);
routes.post('/lead/messenger', LeadMessengersController.update);
routes.put('/event/course-finished', EventController.courseFinishedLogCreate);
routes.put('/lesson-event', LessonEventController.lessonEventLogCreate);







export default routes;