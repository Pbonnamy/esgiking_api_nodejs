import {DishesSeeder, OrderStatusesSeeder, RestaurantsSeeder, UsersSeeder, UserTypesSeeder} from "./seeders";
import {DishModel, OrderModel, OrderStatusModel, RestaurantModel, UserModel, UserTypeModel} from "../models";

export class SeedUtil {
    public static async seed(test: boolean = false, fresh: boolean = false) {
        if (fresh) {
            await this.erase();
        }

        await UserTypesSeeder.seed();
        await OrderStatusesSeeder.seed();

        if (test) {
            const restaurant = await RestaurantsSeeder.seed();
            await UsersSeeder.seed(restaurant);
            await DishesSeeder.seed(restaurant);
        }
    }

    public static async erase() {
        await RestaurantModel.deleteMany();
        await OrderStatusModel.deleteMany();
        await OrderModel.deleteMany();
        await UserModel.deleteMany();
        await UserTypeModel.deleteMany();
        await DishModel.deleteMany();
    }
}