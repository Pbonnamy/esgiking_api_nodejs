import mongoose, {Schema, Document, Model} from "mongoose";

const menuSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    price: {
        type: Schema.Types.Number,
    },
    dishes: {
        type: Schema.Types.Array,
    },
}, {
    collection: "menus",
    timestamps: true,
    versionKey: false
});

export interface MenuProps {
    name: string;
    price: number;
    dishes: string;
}

export type MenuDocument = MenuProps & Document;
export const MenuModel: Model<MenuDocument> = mongoose.model<MenuDocument>("Menus", menuSchema);