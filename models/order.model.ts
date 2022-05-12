import mongoose, {Schema, Document, Model} from "mongoose";
import {RestaurantProps} from "./restaurant.model";
import {DishProps} from "./dish.model";
import {UserProps} from "./user.model";

const orderSchema = new Schema({
    price: {
        type: Schema.Types.Number,
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    dishes: [{
        type: Schema.Types.ObjectId,
        ref: "Dish"
    }],
    client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    collection: "orders",
    timestamps: true,
    versionKey: false
});

export interface OrderProps {
    _id: string;
    price: number;
    restaurant: RestaurantProps;
    dishes: DishProps[];
    client: UserProps;
}

export type OrderDocument = OrderProps & Document;
export const OrderModel: Model<OrderDocument> = mongoose.model<OrderDocument>("Order", orderSchema);