import {OrderStatusModel} from "../../models";


export class OrderStatusesSeeder {
    public static async seed() {
        const types = [
            {
                id: 1,
                name: "Ordered"
            },
            {
                id: 2,
                name: "Preparation"
            },
            {
                id: 3,
                name: "Delivering"
            },
            {
                id: 4,
                name: "Delivered"
            }
        ];

        for (const type of types) {
            const exist = await OrderStatusModel.findById(type.id).exec()

            if (!exist) {
                await new OrderStatusModel({
                    _id: type.id,
                    name: type.name
                }).save();
            } else {
                exist.name = type.name
                await exist.save();
            }
        }
    }
}