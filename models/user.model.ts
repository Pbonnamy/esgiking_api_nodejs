import mongoose, {Schema, Document, Model} from "mongoose";
import {UserTypeProps} from "./user-type.model";
import {RestaurantProps} from "./restaurant.model";

const userSchema = new Schema({
    login: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    type: {
        type: Schema.Types.Number,
        ref: "UserType"
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
    }
}, {
    collection: "users",
    timestamps: true,
    versionKey: false
});

export interface UserProps {
    type: UserTypeProps
    login: string;
    password?: string;
    restaurant?: RestaurantProps;
}

export type UserDocument = UserProps & Document;
export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);