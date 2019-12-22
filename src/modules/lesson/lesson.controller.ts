import { getManager } from 'typeorm';

import { LessonEntity } from './lesson.entity';

export class LessonController {
    static async lessonRead(ctx, next) {
        try {
            const userId = ctx.request.query.userId;
            const lessonId = ctx.request.query.lessonId;
            const lessonRepository = await getManager().getRepository(LessonEntity);
            const lesson = await lessonRepository.findOne({ where: { lessonId: lessonId }});
            const max = await lessonRepository.query('SELECT max(lesson_id) FROM lesson;');
            ctx.response.body = { ...lesson, max: max[0].max };
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
        next();
    }
}