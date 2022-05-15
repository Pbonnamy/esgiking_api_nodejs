import {DishesSeeder, RestaurantsSeeder, UsersSeeder, UserTypesSeeder} from "./seeders";
import {DishModel, OrderModel, RestaurantModel, UserModel, UserTypeModel} from "../models";

export class SeedUtil {
    public static async seed(test: boolean = false, clean: boolean = false) {
        if (clean) {
            await this.erase();
        }

        await UserTypesSeeder.seed();

        if (test) {
            const restaurant = await RestaurantsSeeder.seed();
            await UsersSeeder.seed(restaurant);
            await DishesSeeder.seed(restaurant);
        }
    }

    public static async erase() {
        await RestaurantModel.deleteMany();
        await OrderModel.deleteMany();
        await UserModel.deleteMany();
        await UserTypeModel.deleteMany();
        await DishModel.deleteMany();
    }
}