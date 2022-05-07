import mongoose, {Schema, Document, Model} from "mongoose";

const restaurantSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    address: {
        type: Schema.Types.String,
        required: true
    },
    phone: {
        type: Schema.Types.String,
    },
    description: {
        type: Schema.Types.String,
    },
}, {
    collection: "restaurants",
    versionKey: false
});

export interface RestaurantProps {
    name: string;
    address: string;
    phone: string;
    description?: string;
}

export type RestaurantDocument = RestaurantProps & Document;
export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);