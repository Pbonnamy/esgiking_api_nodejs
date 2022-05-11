import mongoose, {Schema, Document, Model} from "mongoose";
import {RestaurantProps} from "./restaurant.model";

const dishSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    price: {
        type: Schema.Types.Number,
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    }
}, {
    collection: "dishes",
    timestamps: true,
    versionKey: false
});

export interface DishProps {
    _id: string;
    name: string;
    price: number;
    restaurant: RestaurantProps;
}

export type DishDocument = DishProps & Document;
export const DishModel: Model<DishDocument> = mongoose.model<DishDocument>("Dish", dishSchema);