import { getManager } from 'typeorm';

import { PartnerEntity } from '../partner/partner.entity';
import { EventLogs } from '../../lib/eventLogs';
import { EventEntity } from './event.entity';

export async function trackEventLog (eventLog: EventLogs, payloadData: any, partner: PartnerEntity) {
    const eventRepository = getManager().getRepository(EventEntity);

    const newLog = await eventRepository.create({
        eventLog,
        payloadData: !!payloadData ? JSON.stringify(payloadData) : '{}',
        createdDate: new Date().toISOString(),
        partner
    });

    await eventRepository.save(newLog);
}