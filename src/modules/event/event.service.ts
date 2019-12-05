import { getManager } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { EventLogs } from '../../lib/eventLogs';
import { EventEntity } from './event.entity';

export async function trackEventLog (eventLog: EventLogs, payloadData: any, leader: UserEntity) {
    const eventRepository = getManager().getRepository(EventEntity);

    const newLog = await eventRepository.create({
        eventLog: eventLog,
        createdDate: new Date().toISOString(),
        payloadData: !!payloadData ? JSON.stringify(payloadData) : '"{}"',
        leader: leader,
    });

    await eventRepository.save(newLog);
}