import {DishModel, RestaurantProps, UserModel} from "../../models";

export class DishesSeeder {
    public static async seed(restaurant: RestaurantProps) {
        const dishes = [
            {
                name: "Hamburger",
                price: 2.99
            },
            {
                name: "CheeseBurger",
                price: 3.99
            },
            {
                name: "Fishburger",
                price: 4.49
            },
            {
                name: "Salad",
                price: 3.49
            },
            {
                name: "Fries",
                price: 2.99
            },
            {
                name: "Coca-cola",
                price: 1.49
            },
            {
                name: "Sprite",
                price: 1.49
            },
            {
                name: "Cookie",
                price: 1.99
            },
            {
                name: "Donut",
                price: 1.49
            }
        ];

        for (const dish of dishes) {
            const exist = await DishModel.find({name : dish.name}).exec()

            if (exist.length === 0) {
                await new DishModel({
                    name: dish.name,
                    price: dish.price,
                    restaurant: restaurant,
                }).save();
            }
        }
    }
}