import { OrderService } from './order.service';
import { CreateOrderDto } from './DTO/create-order.dto';

export class OrderController {
    static async create(ctx, next){
        const orderService = new OrderService;
        const order = ctx.request.body;

        console.log(order)
        
        order.user = ctx.currentParnter.id;
        
        ctx.response.body = await orderService.create(order);

        next();
    }

    static async check(ctx, next) {
        const orderService = new OrderService;
        const resp = ctx.request.body;

        await orderService.check(resp);
        ctx.status = 200;

        next();
    }
}