import {RestaurantModel, UserTypeModel} from "../models";

export class SeedUtil {
    public static async seedUserTypes() {
        const types = [
            {
                id: 1,
                name: "super admin"
            },
            {
                id: 2,
                name: "admin"
            },
            {
                id: 3,
                name: "employee"
            },
            {
                id: 4,
                name: "client"
            }
        ];

        for (const type of types) {
            const exist = await UserTypeModel.findById(type.id).exec()

            if (!exist) {
                await new UserTypeModel({
                    _id: type.id,
                    name: type.name
                }).save();
            }
        }
    }

    public static async seed() {
        await this.seedUserTypes();
    }
}