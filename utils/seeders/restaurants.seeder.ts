import {RestaurantModel} from "../../models";

export class RestaurantsSeeder {
    public static async seed() {
        const restaurant = {
            name: "main restaurant",
            address: "242 Rue du Faubourg Saint-Antoine, 75012 Paris",
            phone: "01 56 06 90 41",
            long: 2.3896,
            lat: 48.8492
        };

        const exist = await RestaurantModel.find({name : restaurant.name}).exec()

        if (exist.length === 0) {
            return await new RestaurantModel({
                name: restaurant.name,
                address: restaurant.address,
                phone: restaurant.phone,
                long: restaurant.long,
                lat: restaurant.lat
            }).save();
        } else {
            return exist[0];
        }

    }
}