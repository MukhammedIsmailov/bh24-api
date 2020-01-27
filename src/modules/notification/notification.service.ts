import { getManager } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { LeadMessengersEntity } from '../leadMessengers/leadMessengers.entity';
import { NotificationEntity } from './notification.entity';

export async function createNotification(createdDate: Date, leader: UserEntity, lead: UserEntity,
                                         messenger: LeadMessengersEntity) {
    const notificationRepository = getManager().getRepository(NotificationEntity);

    const createdNotification = notificationRepository.create({
        createdDate: createdDate.toISOString(),
        leader: leader,
        lead: lead,
        messenger: messenger
    });

    await notificationRepository.save(createdNotification);
}

export async function updateNotification(leadId: number) {
    await getManager().query(`UPDATE notification SET updated_date = now() WHERE lead_id = ${leadId};`);
}