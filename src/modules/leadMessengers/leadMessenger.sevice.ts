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
    });

    return leadMessengersRepository.save(newLeadMessengers);
}