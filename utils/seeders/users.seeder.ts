import {RestaurantProps, UserModel} from "../../models";
import {AuthUtil} from "../auth.util";

export class UsersSeeder {
    public static async seed(restaurant: RestaurantProps) {
        const users = [
            {
                login: "root",
                type: 1
            },
            {
                login: "admin",
                type: 2,
                restaurant: restaurant
            },
            {
                login: "employee",
                type: 3,
                restaurant: restaurant
            },
            {
                login: "client",
                type: 4,
                address: "30 Rue du Sergent Bauchat, 75012 Paris",
                lat: 48.845689,
                long: 2.3935
            },
            {
                login: "deliverer",
                type: 5,
                restaurant: restaurant,
                lat: 48.86253,
                long: 2.36928
            },
            {
                login: "deliverer 2",
                type: 5,
                restaurant: restaurant,
                lat: 47.087637,
                long: 2.396499
            }
        ];

        for (const user of users) {
            const exist = await UserModel.find({login : user.login}).exec()

            if (exist.length === 0) {
                await new UserModel({
                    login: user.login,
                    password: AuthUtil.sha512("test1234"),
                    type: user.type,
                    restaurant: user.restaurant,
                    address: user.address,
                    long: user.long,
                    lat: user.lat
                }).save();
            }
        }
    }
}