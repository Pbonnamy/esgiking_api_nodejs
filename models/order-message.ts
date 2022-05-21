import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";

const orderMessageSchema = new Schema({
    text: {
        type: Schema.Types.String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Schema.Types.Date,
        require: true
    }
}, {
    collection: "order_messages",
    versionKey: false
});

export interface OrderMessageProps {
    _id: number;
    text: string;
    sender: UserProps;
    date: Date;
}

export type OrderMessageDocument = OrderMessageProps & Document;
export const OrderMessageModel: Model<OrderMessageDocument> = mongoose.model<OrderMessageDocument>("OrderMessage", orderMessageSchema);