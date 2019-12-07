import { getManager } from 'typeorm';

import { ILessonEventLogCreate } from './DTO/ILessonEventLogCreate';
import { LessonEventEntity } from './lessonEvent.entity'
import { UserEntity } from '../user/user.entity';

export class LessonEventController {
    static async lessonEventLogCreate (ctx, next) {
        try {
            const data: ILessonEventLogCreate = ctx.request.body;

            if (!!data.id && !!data.step) {
                const userRepository = getManager().getRepository(UserEntity);
                const lessonEventRepository = getManager().getRepository(LessonEventEntity);

                const lead = await userRepository.findOne( { where: { id: data.id }});

                if (!!lead) {
                    const newLog = await lessonEventRepository.create({
                        lessonNumber: data.step,
                        createdDate: new Date().toISOString(),
                        lead: lead
                    });

                    await lessonEventRepository.save(newLog);

                    ctx.status = 200;
                } else {
                    ctx.status = 404;
                }
            } else {
                ctx.status = 400;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }
}