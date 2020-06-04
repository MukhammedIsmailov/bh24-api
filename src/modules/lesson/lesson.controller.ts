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

    static async lessonIsDone(ctx, next) {
        try {
            const userId = ctx.request.query.userId;
            const lessonId = ctx.request.query.lessonId;
            const query = `SELECT CASE
                              WHEN reading_date IS NOT NULL THEN TRUE
                                ELSE FALSE END AS done
                           FROM lesson_event
                           WHERE lead_id = ${userId} AND lesson_number = ${lessonId};`;
            const result = await getManager().query(query);
            let isDone = false;
            if(result.length > 0) {
                isDone = result[0].done;
            }
            ctx.response.body = { isDone };
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
        next();
    }

    static async getCountRoadLesson(ctx, next) {
        const userId = ctx.request.query.userId;

        const queryForLessons = `SELECT count(id) FROM lesson;`;
        const queryForEvents = `SELECT count(id) FROM lesson_event WHERE lead_id = ${userId} AND reading_date IS NOT NULL;`;
        try {
            const resultOfLessons = await getManager().query(queryForLessons);
            const numberOfLessons = parseInt(resultOfLessons[0].count);
            const resultOfEvents = await getManager().query(queryForEvents);
            const numberOfEvents = parseInt(resultOfEvents[0].count);
            ctx.response.body = { result: numberOfEvents === numberOfLessons - 1};
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
        next();
    }
}