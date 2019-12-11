import { getManager } from 'typeorm';
import * as moment from 'moment';

import { EventEntity } from '../event/event.entity';
import { IStatisticsForPlotRequest } from './DTO/IStatisticsForPlot';
import { EventLogs } from '../../lib/eventLogs';

export class StatisticsController {
    static async statisticsForPlotRead (ctx, next) {
        const data = <IStatisticsForPlotRequest>ctx.request.query;

        const psqlDateFormat = 'YYYY-MM-DD HH:mm:ss';

        const endDateTime = !!data.endDate ? moment.unix(parseInt(data.endDate, 10)).utc() : moment().utc();
        const startDateTime = !!data.startDate ? moment.unix(parseInt(data.startDate, 10)).utc() : endDateTime.clone().subtract(1, 'months').utc();

        const startDate = startDateTime.format(psqlDateFormat);
        const endDate = endDateTime.format(psqlDateFormat);

        try {
            const eventTypes: string[] = Object.keys(EventLogs).map(key => { return EventLogs[key] });

            const eventRepository = getManager().getRepository(EventEntity);

            const countsData = await eventRepository.query(`SELECT count(id), event_log FROM event
                WHERE created_date > '${startDate}' AND created_date < '${endDate}' GROUP BY event_log;`);

            const totalCount = await eventRepository.query('SELECT count(id) FROM event;');

            const countsForPaymentEfficiency = await eventRepository.query(`SELECT count(id), event_log FROM event 
                WHERE event_log = '${EventLogs.landingVisit}' OR event_log = '${EventLogs.paidAffiliate}' GROUP BY event_log;`);

            const countsForCourseEfficiency = await eventRepository.query(`SELECT count(id), event_log FROM event 
                WHERE event_log = '${EventLogs.courseSubscription}' OR event_log = '${EventLogs.courseFinished}' GROUP BY event_log;`);

            const dataForPlot = await eventRepository.query(`SELECT to_char(date_trunc('day', created_date),
                'DD MON YY') AS date, count(1), event_log FROM event WHERE created_date > '${startDate}'
                AND created_date < '${endDate}' GROUP BY 1, event_log;`);

            const countOfCourseFinishedRAW = countsForCourseEfficiency.find(item => { return item['event_log'] === EventLogs.courseFinished });
            const countOfCourseSubscriptionRAW = countsForCourseEfficiency.find(item => { return item['event_log'] === EventLogs.courseSubscription });

            const countOfTransitionsRAW = countsForPaymentEfficiency.find(item => { return item['event_log'] === EventLogs.landingVisit });
            const countOfPaymentsRAW = countsForPaymentEfficiency.find(item => { return item['event_log'] === EventLogs.paidAffiliate });

            const countOfTransitions = !!countOfTransitionsRAW ? parseInt(countOfTransitionsRAW['count']) : 0;
            const countOfPayments = !!countOfPaymentsRAW ? parseInt(countOfPaymentsRAW['count']) : 0;

            const countOfCourseFinished = !!countOfCourseFinishedRAW ? parseInt(countOfCourseFinishedRAW['count']) : 0;
            const countOfCourseSubscription = !!countOfCourseSubscriptionRAW ? parseInt(countOfCourseSubscriptionRAW['count']) : 0;

            const paymentEfficiency = !!countOfTransitions && !!countOfPayments ? Math.round(countOfPayments / countOfTransitions * 100): 0;
            const courseEfficiency = !!countOfCourseFinished && !!countOfCourseSubscription ? Math.round(countOfCourseFinished / countOfCourseSubscription * 100) : 0;

            const counts = [];
            const total = parseInt(totalCount[0]['count']);
            const plotData = [];

            for (const type of eventTypes) {
                plotData.push({ [type ]: []});
                counts.push({ [type]: 0 });
                for (const item of countsData) {
                    if (type === item['event_log']) {
                        counts[counts.length - 1][type] = parseInt(item['count']);
                        break;
                    }
                }

                for (const item of dataForPlot) {
                    if (type === item['event_log']) {
                        plotData[plotData.length - 1][type].push({
                            date: item['date'],
                            count: item['count'],
                            timestamp: parseInt(moment.utc(item['date'], 'DD MMM YY').format('X')),
                        });
                    }
                }
            }

            ctx.body = {
                counts,
                total,
                paymentEfficiency,
                courseEfficiency,
                plotData
            };

            ctx.status = 200;

            next();

        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }
}