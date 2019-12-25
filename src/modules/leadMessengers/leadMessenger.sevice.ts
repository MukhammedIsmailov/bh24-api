import { getManager } from 'typeorm';

import { Messenger } from './DTO/IMessengerInfo';
import { LeadMessengersEntity } from './leadMessengers.entity';

export async function createNewLeadMessengerItem(data, lead): Promise<any> {
    const leadMessengersRepository = getManager().getRepository(LeadMessengersEntity);
    const newLeadMessengers = await leadMessengersRepository.create({
        user: lead,
        telegramInfo: (data.messengerInfo.messenger === Messenger.Telegram) ? data.messengerInfo.info : null,
        facebookInfo: (data.messengerInfo.messenger === Messenger.Facebook) ? data.messengerInfo.info : null,
        step: data.messengerInfo.step,
        lastSendTime: new Date().toISOString(),
        from: data.messengerInfo.messenger,
        username: data.messengerInfo.username,
    });

    return leadMessengersRepository.save(newLeadMessengers);
}

export async function updateLeadMessengerItem(data): Promise<void> {
    const leadMessengersRepository = getManager().getRepository(LeadMessengersEntity);
    const query = `UPDATE lead_messengers SET last_send_time = now(), step = ${data.step} WHERE user_id = ${data.id};`;
    await leadMessengersRepository.query(query);
}