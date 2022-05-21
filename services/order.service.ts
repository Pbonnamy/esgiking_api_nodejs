import {OrderDocument, OrderModel, OrderProps, UserProps} from "../models";
import {UserService} from "./user.service";
import {OrderMessageDocument, OrderMessageModel, OrderMessageProps} from "../models";

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

    public async createMessage(props: Partial<OrderMessageProps>, id: string): Promise<OrderMessageDocument> {
        const model = new OrderMessageModel(props);
        const res = await model.save();

        const orderData = await this.getOneById(id);
        await orderData?.messages.push(res);
        await orderData?.save();

        return res;
    }

    async getAll(filter: object): Promise<OrderDocument[]> {
        return OrderModel.find(filter).populate("dishes").populate("menus").populate("client").populate("messages").exec();
    }

    async getOneById(id: string): Promise<OrderDocument | null> {
        return OrderModel.findById(id).populate("dishes").populate("menus").populate("client").populate("messages").exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const res = await OrderModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    getDistanceFromLatLonInKm(lat1 :number, lon1 :number, lat2: number, lon2: number) {
        let R = 6371; // Radius of the earth in km
        let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        let dLon = this.deg2rad(lon2-lon1);
        let a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
    }

    deg2rad(deg: number) {
        return deg * (Math.PI/180)
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

        if(props.status !== undefined) {

            if (order.status === 3) {
                let user: UserProps | null = null;

                const users = await UserService.getInstance().getAll(order.restaurant._id.toString());
                let min: number | null = null;
                users.forEach(el => {
                    if(el.lat && el.long) {
                        let distance = this.getDistanceFromLatLonInKm(el.lat, el.long, order.client.lat, order.client.long);
                        if (!min) {
                            user = el
                            min = distance
                        }else if (distance < min) {
                            min = distance
                            user = el
                        }
                    }
                })

                if (!user) {
                    throw new Error("no deliverer")
                }

                order.deliverer = user
            }

            order.status = props.status
        }

        order.price = Number(order.price.toFixed(2))

        return await order.save();
    }
}