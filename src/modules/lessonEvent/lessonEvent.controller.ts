import { getManager } from 'typeorm';

import { ILessonEventLogCreate } from './DTO/ILessonEventLogCreate';
import { LessonEventEntity } from './lessonEvent.entity'
import { UserEntity } from '../user/user.entity';
import { updateLeadMessengerItem } from '../leadMessengers/leadMessenger.sevice';

export class LessonEventController {
    static async lessonEventLogCreate (ctx, next) {
        try {
            const data: ILessonEventLogCreate = ctx.request.body;
            let lastStep = 0;

            if (!!data.id && !!data.step) {
                const userRepository = getManager().getRepository(UserEntity);
                const lessonEventRepository = getManager().getRepository(LessonEventEntity);

                const lead = await userRepository.findOne( { where: { id: data.id }});

                if (!!data.extern) {
                    lastStep = await getManager()
                        .query(`SELECT max(lesson_number) from lesson_event WHERE lead_id = ${data.id};`);
                    lastStep = lastStep[0].max;

                    if(lastStep < data.step) {
                        const newLog = await lessonEventRepository.create({
                            lessonNumber: data.step,
                            createdDate: new Date().toISOString(),
                            lead: lead,
                            readingDate: new Date().toISOString(),
                        });

                        await lessonEventRepository.save(newLog);

                        await updateLeadMessengerItem(data);
                    } else {
                        const log = await lessonEventRepository
                            .query(`SELECT id FROM lesson_event WHERE lesson_number = ${data.step} AND lead_id = ${data.id};`);

                        await lessonEventRepository.query(`UPDATE lesson_event SET reading_date = '${new Date().toISOString()}' WHERE id = ${log[0].id};`);
                    }
                } else {
                    const newLog = await lessonEventRepository.create({
                        lessonNumber: data.step,
                        createdDate: new Date().toISOString(),
                        lead: lead,
                        readingDate: null,
                    });

                    await lessonEventRepository.save(newLog);
                }
            }
            else {
                ctx.status = 400;
            }
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }

        next();
    }

    static async lessonEventsRead (ctx, next) {
        try {
            const id = Number.parseInt(ctx.request.query.id);

            if(!Number.isNaN(id)) {
                const userRepository = getManager().getRepository(UserEntity);
                const lessonEventRepository = getManager().getRepository(LessonEventEntity);

                const user = await userRepository.findOne({ where: { id: id } });
                if (!!user) {
                    const lessons = await lessonEventRepository.find({
                        where: { lead: user },
                        select: ['lessonNumber', 'readingDate']
                    });

                    ctx.response.body = {
                        firstName: user.firstName,
                        secondName: user.secondName,
                        iconUrl: user.iconUrl,
                        lessons,
                    };

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