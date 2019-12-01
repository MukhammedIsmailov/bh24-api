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
            const eventRepository = getManager().getRepository(EventEntity);

            const dataFromDb = await eventRepository.query(`SELECT to_char(date_trunc('day', created_date), 
                'DD MON YY') AS date, count(1), event_log FROM event WHERE created_date > '${startDate}' 
                AND created_date < '${endDate}' GROUP BY 1, event_log;`);

            console.log(dataFromDb)

            ctx.status = 200;

        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }
}