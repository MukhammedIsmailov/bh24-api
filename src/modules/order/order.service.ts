import { getManager } from 'typeorm';
import { config } from 'dotenv';
import * as sha1 from 'sha1';
import * as axios from 'axios';

import { OrderEntity } from './order.entity';
import { ProductEntity } from '../product/product.entity';
import { UserEntity } from '../user/user.entity';

config();

export class OrderService{
    orderRepository: any;
    productRepository: any;
    userRepository: any;

    constructor(){
        this.orderRepository = getManager().getRepository(OrderEntity);
        this.productRepository = getManager().getRepository(ProductEntity);
        this.userRepository = getManager().getRepository(UserEntity);
    }

    async getPaymentLink(price, productId, orderId ){
        let data = {
            request: {
                amount: price.toString(),
                currency: process.env.CURENCY,
                merchant_id: process.env.MERCHANT_ID.toString(),
                order_desc: `Оплата заказа № ${orderId}`,
                order_id: orderId.toString(),
                product_id: productId.toString(),
                response_url: process.env.PAYMENT_CHECK_URL,
                signature: ''
            }
        }
      
        let signatureStr: string = process.env.PAYMENT_KEY + '|';
      
        for (const key in data.request)
          signatureStr += `${data.request[key]}|`;
      
        data.request.signature = sha1(signatureStr.slice(0, -2)).toString();
      
        const resp = await axios.default.post('https://api.fondy.eu/api/checkout/url/', data);
        return resp.data.response;
    }

    async create(body){
        const order = await this.orderRepository.save(body);
        const product = await this.productRepository.findOne({ id: order.product });

        return this.getPaymentLink(product.price, product.id, order.id);
    }

    async check(body){

        if (body.order_status == 'approved'){
            const order = await this.orderRepository.save({
                id: parseInt(body.order_id), 
                payed_at: new Date().toISOString()
            });

            const orderWithRelations = await this.orderRepository.findOne(order.id, {relations: ['user', 'product']});
            
            let subscription_end = new Date(order.payed_at);
            subscription_end.setDate(subscription_end.getDate() + orderWithRelations.product.duration);

            await this.userRepository.save({
                id: orderWithRelations.user.id,
                subscription_end: subscription_end.toISOString(),
                subscription_name: orderWithRelations.product.name
            });
        }
    }
}