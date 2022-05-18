import mongoose, {Schema, Document, Model} from "mongoose";

const orderStatusSchema = new Schema({
    _id: {
        type: Schema.Types.Number,
    },
    name: {
        type: Schema.Types.String,
        required: true
    },
}, {
    collection: "order_statuses",
    versionKey: false
});

export interface OrderStatusProps {
    _id: number;
    name: string;
}

export type OrderStatusDocument = OrderStatusProps & Document;
export const OrderStatusModel: Model<OrderStatusDocument> = mongoose.model<OrderStatusDocument>("OrderStatus", orderStatusSchema);