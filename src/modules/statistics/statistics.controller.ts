import { getManager } from 'typeorm';
import * as moment from 'moment';

import { EventEntity } from '../event/event.entity';
import { IStatisticsForPlotRequest } from './DTO/IStatisticsForPlot';
import { EventLogs } from '../../lib/eventLogs';
import { plotDataGenerate } from './statistics.service';
import {LessonEventEntity} from "../lessonEvent/lessonEvent.entity";

export class StatisticsController {
    static async statisticsRead (ctx, next) {
        let data = <IStatisticsForPlotRequest>ctx.request.query;
        data.startDate = data.startDate ?? "0";
        data.endDate = data.endDate ?? Date.now().toString();
        data.interval = data.interval ?? 'month';
        const psqlDateFormat = 'YYYY-MM-DD HH:mm:ss';

        let endDateTime = !!data.endDate ? moment.unix(parseInt(data.endDate, 10)).utc() : moment().utc();
        let startDateTime = !!data.startDate ? moment.unix(parseInt(data.startDate, 10)).utc() : endDateTime.clone().subtract(1, 'months').utc();

        if(data.interval !== 'null') {
            endDateTime = moment().utc();
            startDateTime = endDateTime.clone().subtract(1, data.interval).utc();
        }

        const startDate = startDateTime.format(psqlDateFormat);
        const endDate = endDateTime.format(psqlDateFormat);

        try {
            const eventTypes: string[] = Object.keys(EventLogs).map(key => { return EventLogs[key] });

            const eventRepository = getManager().getRepository(EventEntity);

            const countsData = await eventRepository.query(`SELECT count(id), event_log FROM event
                WHERE created_date > '${startDate}' AND created_date < '${endDate}' AND leader_id = ${ctx.currentParnter.id} 
                GROUP BY event_log;`);

            const totalCount = await eventRepository.query(`SELECT count(id) FROM event WHERE leader_id = ${ctx.currentParnter.id};`);

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

            const paymentEfficiency = Math.round((counts[5]['NC'] + counts[4]['NP']) / counts[0]['VL'] * 100 );

            const courseFinished = (await getManager().getRepository(LessonEventEntity)
                .query(`SELECT count(*) FROM (SELECT count(*) AS num FROM (SELECT u.id as user_id
            FROM lesson_event JOIN "user" u on u.id = lesson_event.lead_id
            WHERE (lesson_number = 1 OR lesson_number = 2 OR lesson_number = 3 OR lesson_number = 4) AND reading_date notnull AND leader_id = ${ctx.currentParnter.id}) AS l
            GROUP BY user_id) AS l WHERE num = 4;`))[0].count;


            ctx.body = {
                counts,
                total,
                courseFinished,
                paymentEfficiency,
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
        const limit = ctx.request.query.limit;
        try {
            const query = `SELECT 
                                first_name AS "firstName",
                                second_name AS "secondName", 
                                country,
                                u.created_date AS "createdDate"
                            FROM lead_messengers
                              INNER JOIN "user" u on lead_messengers.user_id = u.id
                              ORDER BY "createdDate" DESC LIMIT ${limit};`;
            const countQuery = 'SELECT count(id) FROM lead_messengers';

            const registrations = await getManager().query(query);
            const count = await getManager().query(countQuery);

            ctx.response.body = { registrations, count: count[0].count };
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async latestRegistrationsByLeaders (ctx, next) {
        try {
            const { interval } = ctx.request.query;
            const query = `SELECT id, first_name AS "firstName", 
                              second_name AS "secondName", 
                              icon_url AS "iconUrl", 
                              events.count
                              FROM "user"
                              INNER JOIN (SELECT leader_id, count(event.id) AS count
                                FROM event
                                WHERE event_log = 'SC'
                                  AND created_date > now() - INTERVAL '${interval}'
                                GROUP BY leader_id) AS events ON "user".id = events.leader_id
                            ORDER BY events.count DESC LIMIT 5;`;
            ctx.response.body = await getManager().query(query);
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }
}