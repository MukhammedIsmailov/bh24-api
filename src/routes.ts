import * as Router from 'koa-router';

import { UserController } from './modules/user/user.controller';
import { LeadMessengersController } from './modules/leadMessengers/leadMessengers.controller';
import { EventController } from './modules/event/event.controller';
import { StatisticsController } from './modules/statistics/statistics.controller';
import { LessonEventController } from './modules/lessonEvent/lessonEvent.controller';
import { LessonController } from './modules/lesson/lesson.controller';
import { OrderController } from './modules/order/order.controller';
import { IpController } from './modules/ip/ip.controller';

import { verifyToken } from './lib/jwt';
import { upload } from './lib/upload';
import { MailController } from './modules/mail/mail.controller';
import { CommentController } from './modules/comments/comment.controller';
import { PageController } from './modules/page/page.controller';
import { ContentController } from './modules/content/content.controller';
import { ProductController } from './modules/product/product.controller';
import { FileController } from './modules/file/file.controller';

const routes = new Router({ prefix: '/api' });

// for system
routes.get('/me',verifyToken, UserController.me);
routes.post('/login', UserController.authorize);
routes.put('/reset-password-query', UserController.resetPasswordQuery);
routes.put('/reset-password', UserController.resetPassword);
routes.put('/partner', UserController.partnerCreate);
routes.get('/partner/byId', UserController.partnerReadById);
routes.get('/partner/byReferId', UserController.partnerReadByReferId);
routes.post('/partner', verifyToken, UserController.partnerUpdate);
routes.post('/upload', upload);
routes.post('/ward', verifyToken, UserController.wardUpdate);
routes.post('/wards', verifyToken, UserController.wardRead);
routes.get('/statistics', verifyToken, StatisticsController.statisticsRead);
routes.get('/lesson-events', verifyToken, LessonEventController.lessonEventsRead);
routes.get('/leads', verifyToken, UserController.leadsRead);
routes.get('/latest-registrations', StatisticsController.latestRegistrationsRead);
routes.get('/latest-registrations-by-leaders', StatisticsController.latestRegistrationsByLeaders);
routes.get('/lesson', LessonController.lessonRead);
routes.get('/lesson/all', LessonController.lessonReadAll);
routes.post('/lesson', LessonController.lessonCreate);
routes.put('/lesson', LessonController.lessonUpdate);
routes.delete('/lesson', LessonController.lessonDelete);
routes.get('/lesson/is-done', LessonController.lessonIsDone);
routes.get('/lesson/get-count-road-lesson', LessonController.getCountRoadLesson)
routes.get('/partner/byUserId', UserController.leaderReadByUserId);
routes.put('/event/feedback-button-click', EventController.feedbackButtonClickLogCreate);
routes.put('/event/contacts-see', EventController.contactsSeeEventLog);
routes.post('/bugreport', MailController.bugReport);
routes.get('/getCountryByIp', IpController.getGeoByIp);
routes.post('/comments', CommentController.commentCreate);
routes.get('/comments', CommentController.commentRead);
routes.get('/page/all', PageController.pageReadAll);
routes.get('/page', PageController.pageRead);
routes.post('/page', PageController.pageCreate);
routes.put('/page', PageController.pageUpdate);
routes.delete('/page', PageController.pageDelete);
routes.post('/content', ContentController.contentCreate);
routes.get('/content', ContentController.contentRead);
routes.get('/content/all', ContentController.contentReadByPageId);
routes.put('/content', ContentController.contentUpdate);
routes.delete('/content', ContentController.contentDelete);
routes.post('/product', ProductController.productCreate);
routes.get('/product', ProductController.productRead);
routes.get('/product/all', ProductController.productReadAll);
routes.put('/product', ProductController.productUpdate);
routes.delete('/product', ProductController.productDelete);
routes.post('/file', FileController.fileCreate);
routes.get('/file/all', FileController.fileReadAll);
routes.delete('/file', FileController.fileDelete);
//for payment
routes.post('/order/', verifyToken, OrderController.create);
routes.post('/check/', OrderController.check);

// for landing
routes.put('/event/landing-visit', EventController.landingVisitLogCreate);

// for chat-bots
routes.put('/lead', UserController.leadCreate);
routes.get('/lead/messenger/all', LeadMessengersController.readAll);
routes.post('/lead/messenger', LeadMessengersController.update);
routes.put('/event/course-finished', EventController.courseFinishedLogCreate);
routes.put('/lesson-event', LessonEventController.lessonEventLogCreate);
routes.post('/event', EventController.create);


export default routes;
