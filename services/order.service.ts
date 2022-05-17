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
                price += el.price - (el.price * el.discount / 100);
            })
        }

        if (props.menus) {
            props.menus.forEach((el) => {
                price += el.price - (el.price * el.discount / 100);
            })
        }

        props.price = Number(price.toFixed(2));

        const model = new OrderModel(props);
        return await model.save();
    }

    async getAll(filter: object): Promise<OrderDocument[]> {
        return OrderModel.find(filter).populate("dishes").populate("menus").populate("client").exec();
    }

    async getOneById(id: string): Promise<OrderDocument | null> {
        return OrderModel.findById(id).populate("dishes").populate("menus").populate("client").exec();
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

        order.price = 0;

        if(props.dishes !== undefined) {
            order.dishes = props.dishes;

            props.dishes.forEach((el) => {
                order.price += el.price - (el.price * el.discount / 100);
            })
        } else {
            order.dishes = []
        }

        if(props.menus !== undefined) {
            order.menus = props.menus;
            
            props.menus.forEach((el) => {
                order.price += el.price - (el.price * el.discount / 100);
            })
        } else {
            order.menus = []
        }

        order.price = Number(order.price.toFixed(2))

        return await order.save();
    }
}