import {OrderDocument, OrderModel, OrderProps} from "../models";

export class OrderService {
    private static instance?: OrderService;

    public static getInstance(): OrderService {
        if(OrderService.instance === undefined) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    private constructor() { }


    public async createOne(props: Partial<OrderProps>): Promise<OrderDocument> {
        let price = 0;

        if (props.dishes) {
            props.dishes.forEach((el) => {
                price += el.price;
            })
        }

        props.price = price;
        const model = new OrderModel(props);
        return await model.save();
    }

    async getAll(restaurant: string): Promise<OrderDocument[]> {
        return OrderModel.find({restaurant: restaurant}).populate("dishes").exec();
    }

    async getOneById(id: string): Promise<OrderDocument | null> {
        return OrderModel.findById(id).populate("dishes").exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await OrderModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async updateById(id: string, props: OrderProps): Promise<OrderDocument | null> {
        const order = await this.getOneById(id);
        if(!order) {
            return null;
        }

        if(props.dishes !== undefined) {
            let price = 0;
            order.dishes = props.dishes;

            props.dishes.forEach((el) => {
                price += el.price;
            })

            order.price = price
        }

        return await order.save();
    }
}