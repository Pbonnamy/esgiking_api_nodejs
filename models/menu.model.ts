import mongoose, {Schema, Document, Model} from "mongoose";
import {DishProps} from "./dish.model";
import {RestaurantProps} from "./restaurant.model";

const menuSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    price: {
        type: Schema.Types.Number,
        required: true
    },
    discount:{
        type: Schema.Types.Number,
        min: 0,
        max: 100,
        default: 0
    },
    dishes: [{
        type: Schema.Types.ObjectId,
        ref: "Dish",
        required: true
    }],
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
}, {
    collection: "menus",
    timestamps: true,
    versionKey: false
});

export interface MenuProps {
    _id: string
    name: string;
    price: number;
    discount: number;
    restaurant: RestaurantProps;
    dishes: DishProps[];
}

export type MenuDocument = MenuProps & Document;
export const MenuModel: Model<MenuDocument> = mongoose.model<MenuDocument>("Menu", menuSchema);