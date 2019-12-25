import { getManager } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { EventLogs } from '../../lib/eventLogs';
import { EventEntity } from './event.entity';

export async function trackEventLog (eventLog: EventLogs, payloadData: any, leader: UserEntity, lead?: UserEntity) {
    const eventRepository = getManager().getRepository(EventEntity);

    const newLog = await eventRepository.create({
        eventLog: eventLog,
        createdDate: new Date().toISOString(),
        payloadData: !!payloadData ? JSON.stringify(payloadData) : '"{}"',
        leader: leader,
        lead: !!lead ? lead : null,
    });

    await eventRepository.save(newLog);
}