import { getManager } from 'typeorm';
import * as moment from 'moment';

import { EventEntity } from '../event/event.entity';
import { IStatisticsForPlotRequest } from './DTO/IStatisticsForPlot';
import { EventLogs } from '../../lib/eventLogs';
import { plotDataGenerate } from './statistics.service';

export class StatisticsController {
    static async statisticsRead (ctx, next) {
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
                WHERE created_date > '${startDate}' AND created_date < '${endDate}' AND leader_id = ${ctx.currentParnter.id} 
                GROUP BY event_log;`);

            const totalCount = await eventRepository.query(`SELECT count(id) FROM event WHERE leader_id = ${ctx.currentParnter.id};`);

            const countsForPaymentEfficiency = await eventRepository.query(`SELECT count(id), event_log FROM event 
                WHERE event_log = '${EventLogs.landingVisit}' OR event_log = '${EventLogs.paidAffiliate}' AND leader_id = ${ctx.currentParnter.id}
                GROUP BY event_log;`);

            const countsForCourseEfficiency = await eventRepository.query(`SELECT count(id), event_log FROM event 
                WHERE (event_log = '${EventLogs.courseSubscription}' OR event_log = '${EventLogs.courseFinished}') AND leader_id = ${ctx.currentParnter.id}
                GROUP BY event_log;`);

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

            const firstParam = moment().diff(endDate, 'days');
            const secondParam = firstParam + endDateTime.diff(startDateTime, 'days');
            const dataForPlotQueries = eventTypes.map((type: string) => {
                return eventRepository.query(`WITH d AS (SELECT to_char(date_trunc('day', (current_date - offs)), 'DD MON YY') AS date
                        FROM generate_series(${firstParam}, ${secondParam}, 1) AS offs)
                        SELECT d.date, count(CASE WHEN event_log = '${type}' AND leader_id = ${ctx.currentParnter.id} THEN 1 END)
                        FROM d LEFT JOIN event ON d.date = to_char(date_trunc('day', event.created_date), 'DD MON YY')
                        GROUP BY d.date ORDER BY to_timestamp(d.date, 'DD MON YY');`);
            });
            const dataForPlot = await Promise.all((dataForPlotQueries));

            const plotData = plotDataGenerate(dataForPlot, eventTypes);

            for (const type of eventTypes) {
                counts.push({ [type]: 0 });
                for (const item of countsData) {
                    if (type === item['event_log']) {
                        counts[counts.length - 1][type] = parseInt(item['count']);
                        break;
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

        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async latestRegistrationsRead (ctx, next) {
        try {
            const leaderId = ctx.currentParnter.id;
            const startDate = moment().subtract(1, 'months').toISOString();
            const query = `SELECT first_name   AS "firstName",
                              second_name  AS "secondName",
                              icon_url     AS "iconUrl",
                              country,
                              created_date AS "createdDate"
                              FROM "user"
                              WHERE leader_id = ${leaderId}
                                AND created_date BETWEEN '${startDate}' AND now()
                                AND role = 'partner';`;

            ctx.response.body = await getManager().query(query);
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async latestRegistrationsByLeaders (ctx, next) {
        try {
            const leaderId = ctx.currentParnter.id;
            const { interval } = ctx.request.query;
            const query = `SELECT id, first_name AS "firstName", 
                              second_name AS "secondName", 
                              icon_url AS "iconUrl", 
                              leaders.count
                              FROM "user"
                              INNER JOIN (SELECT leader_id, count(id) AS count
                                FROM "user"
                                WHERE role = 'partner'
                                  AND created_date > now() - INTERVAL '${interval}'
                                GROUP BY leader_id) AS leaders ON "user".id = leaders.leader_id
                              WHERE role = 'partner' AND "user".leader_id = ${leaderId};`;

            ctx.response.body = await getManager().query(query);
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }
}