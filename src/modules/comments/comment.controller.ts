import { IComment } from './DTO/IComment';
import { getManager } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../user/user.entity';
import { LessonEntity } from '../lesson/lesson.entity';

export class CommentController {
    static async commentCreate (ctx, next) {
        try {
            const data: IComment = ctx.request.body;
            const commentsRepository = getManager().getRepository(CommentEntity);
            const userRepository = getManager().getRepository(UserEntity);
            const lessonRepository = getManager().getRepository(LessonEntity);

            const user = await userRepository.findOne(data.userId);
            const lesson = await lessonRepository.findOne(data.lessonId);

            const createdComment = await commentsRepository.create({
                createdDate: new Date().toISOString(), user, lesson, text: data.text,
            });

            await commentsRepository.save(createdComment);

            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }

    static  async commentRead (ctx, next) {
        try {
            const commentsRepository = getManager().getRepository(CommentEntity);
            const lessonRepository = getManager().getRepository(LessonEntity);
            const lessonId = ctx.request.query.lessonId;

            const lesson = await lessonRepository.findOne(lessonId);
            const foundComment = await commentsRepository.find({ where: { lesson }, relations: ['user', 'lesson'] });
            ctx.response.body = foundComment;
            ctx.status = 200;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    }
}
