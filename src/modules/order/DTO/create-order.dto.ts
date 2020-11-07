export interface CreateOrderDto{
    product: number;
    autorenewal: boolean;
    user?: number;
}